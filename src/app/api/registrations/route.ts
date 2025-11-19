// src/app/api/registrations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { supabaseServer } from "@/lib/supabase/server-client";
import { registrationService } from "@/lib/email/registration-service";
import { createSnapTransaction } from "@/lib/midtrans/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'category_id', 'full_name', 'email', 'phone',
      'date_of_birth', 'emergency_contact_name', 'emergency_contact_phone'
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
    const { data: existingRegistration } = await supabase
      .from('registrations')
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

    const registrationNumber = await generateRegistrationNumber(category.name);

    if (!registrationNumber) {
      return NextResponse.json(
        { status: false, message: 'Invalid registration number', error: registrationNumber },
        { status: 400 }
      );
    }

    // Create registration in database
    const { data: registration, error: registrationError } = await supabaseServer
      .from('registrations')
      .insert([{
        ...body,
        registration_number: registrationNumber,
        payment_status: 'pending',
      }])
      .select(`
        id,
        registration_number,
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

    const paymentParameter = {
      transaction_details: {
        order_id: `REG-${registration.registration_number}-${Date.now()}`, // Unique order ID
        gross_amount: registration.total_amount,
      },
      customer_details: {
        first_name: registration.full_name,
        email: registration.email,
        phone: registration.phone,
      },
      item_details: [
        {
          id: registration.category_id,
          price: registration.total_amount,
          quantity: 1,
          // @ts-ignore
          name: `Share Your Distance - ${registration?.category?.name}`,
        },
      ],
    };

    // Create Snap transaction
    const paymentResult = await createSnapTransaction(paymentParameter);

    if (!paymentResult) {
      return NextResponse.json(
        { status: false, message: 'Failed to create payment URL' },
        { status: 500 }
      );
    }

    // Send registration confirmation email
    const form = {
      email: registration.email,
      name: registration.full_name,
      // @ts-ignore
      category: registration?.category?.name,
      registration_number: registration.registration_number,
      amount: registration.total_amount,
      payment_url: paymentResult?.redirect_url,
    }

    const sendEmail = await registrationService.sendRegistrationConfirmation(form)

    return NextResponse.json(
      {
        status: true,
        message: 'Registration created successfully',
        email: sendEmail,
        data: registration,
        payment: paymentResult,
        paymentParameter: paymentParameter,
      },
      { status: 201 }
    );
  } catch (error) {
    // console.error('Registration API error:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'Failed to create registration, Please try again or contact support if the problem persists.',
        error
      },
      { status: 500 }
    );
  }
}

// Manual registration number generation
async function generateRegistrationNumber(categoryName: string): Promise<string> {
  // Determine category code
  let categoryCode = 'SYD';
  // if (categoryName.includes('Speed')) categoryCode = 'SPD';
  // else if (categoryName.includes('Estafet')) categoryCode = 'EST';
  // else if (categoryName.includes('Looping')) categoryCode = 'LOP';

  // Get current year
  const yearCode = new Date().getFullYear().toString().slice(-2);

  // Get next sequence number
  const { data: lastRegistration } = await supabase
    .from('registrations')
    .select('registration_number')
    .like('registration_number', `${categoryCode}${yearCode}-%`)
    .order('registration_number', { ascending: false })
    .limit(1)
    .single();

  let sequenceNum = 1;
  if (lastRegistration) {
    const lastSeq = parseInt(lastRegistration.registration_number.split('-')[1]);
    sequenceNum = lastSeq + 1;
  }

  return `${categoryCode}${yearCode}-${sequenceNum.toString().padStart(4, '0')}`;
}