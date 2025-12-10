// src/app/api/registrations-v2/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { supabaseServer } from "@/lib/supabase/server-client";
import { registrationService } from "@/lib/email/registration-service";
// import { createSnapTransaction } from "@/lib/midtrans/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'category_id', 'full_name', 'email', 'phone', 'date_of_birth', 'emergency_contact_name', 'emergency_contact_phone'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { status: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if category exists and has capacity
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, price, max_participants, current_participants')
      .eq('id', body.category_id)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { status: false, message: 'Invalid category selected', error: categoryError },
        { status: 400 }
      );
    }

    // // Check category capacity
    if (category.max_participants && category.current_participants >= category.max_participants) {
      return NextResponse.json(
        { status: false, message: 'This category is full. Please select another category.' },
        { status: 400 }
      );
    }

    // Check for duplicate registration (same email + category)
    const { data: existingRegistration } = await supabaseServer
      .from('registrations_v2')
      .select('id')
      .eq('email', body.email)
      .eq('category_id', body.category_id)
      .in('payment_status', ['pending', 'paid'])
      .single();

    if (existingRegistration) {
      return NextResponse.json(
        { status: false, message: 'You have already registered for this category' },
        { status: 400 }
      );
    }

    const uniqueCode = await generateUniqueCode();

    if (!uniqueCode) {
      return NextResponse.json(
        { status: false, message: 'Invalid unique code', error: uniqueCode },
        { status: 400 }
      );
    }

    // Create registration in database
    const { data: registration, error: registrationError } = await supabaseServer
      .from('registrations_v2')
      .insert([{
        ...body,
        unique_code: uniqueCode,
        payment_status: 'pending',
      }])
      .select(`
        id,
        unique_code,
        full_name,
        email,
        phone,
        total_amount,
        payment_status,
        category_id,
        category:categories (
          id,
          name,
          distance,
          price
        )
      `)
      .single();

    if (registrationError) {
      return NextResponse.json(
        { status: false, message: 'Failed to create registration', error: registrationError },
        { status: 400 }
      );
    }

    // Send registration confirmation email
    const form = {
      email: registration.email,
      name: registration.full_name,
      // @ts-ignore
      category: registration?.category?.name,
      registration_number: registration.unique_code,
      amount: registration.total_amount,
    }

    const sendEmail = await registrationService.sendRegistrationConfirmationV2(form)

    return NextResponse.json(
      {
        status: true,
        message: 'Registration created successfully',
        email: sendEmail,
        data: registration,
      },
      { status: 201 }
    );
  } catch (error) {
    // console.error('Registration API error:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'Failed to create registration, Please try again or contact support if the problem persists.',
      },
      { status: 500 }
    );
  }
}

async function generateUniqueCode(): Promise<string> {

  function randomLetters(length: number) {
    let letters = ""
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let i = 0; i < length; i++) {
      letters += alphabet[Math.floor(Math.random() * alphabet.length)]
    }
    return letters
  }

  const randomDigits = Math.floor(100000 + Math.random() * 900000)
  const twoDigitYear = new Date().getFullYear().toString().slice(-2) || '00'
  return `SYD${twoDigitYear}-${randomLetters(3)}${randomDigits}`
}