import { randomInt } from 'node:crypto';
import { isIP } from 'node:net';
import { NextRequest, NextResponse } from 'next/server';
import { createSnapTransaction } from '@/lib/midtrans/client';
import { registrationService } from '@/lib/supabase/service/registrations/services';
import { supabaseServer } from '@/lib/supabase/server-client';
import { RegistrationCreateInput } from '@/lib/supabase/service/registrations/types';
import { registrationService as emailService } from '@/lib/email/registration-service';

const REGISTRATION_TABLE = 'syd_registrations';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(body: Record<string, unknown>, key: string, maxLength: number): string | null {
  const value = body[key];
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 && normalized.length <= maxLength ? normalized : null;
}

function isGender(value: string | null): value is RegistrationCreateInput['gender'] {
  return value === 'male' || value === 'female' || value === 'other';
}

function isValidStravaUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && ['strava.com', 'www.strava.com'].includes(url.hostname.toLowerCase())
      && /^\/athletes\/[a-z\d_-]+\/?$/i.test(url.pathname);
  } catch {
    return false;
  }
}

function isAtLeast17OnEventDate(dateOfBirth: string): boolean {
  const birthDate = new Date(`${dateOfBirth}T00:00:00.000Z`);
  if (Number.isNaN(birthDate.getTime()) || birthDate.toISOString().slice(0, 10) !== dateOfBirth) {
    return false;
  }
  const eventDate = new Date('2026-12-19T00:00:00.000Z');
  const minimumBirthDate = new Date(Date.UTC(
    eventDate.getUTCFullYear() - 17,
    eventDate.getUTCMonth(),
    eventDate.getUTCDate(),
  ));
  return birthDate <= minimumBirthDate;
}

async function generateRegistrationNumber(): Promise<string> {
  const year = String(new Date().getFullYear()).slice(-2);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const letters = Array.from({ length: 3 }, () => alphabet[randomInt(alphabet.length)]).join('');
    const digits = String(randomInt(1_000_000)).padStart(6, '0');
    const registrationNumber = `SYD${year}-${letters}${digits}`;
    const { data, error } = await supabaseServer
      .from(REGISTRATION_TABLE)
      .select('id')
      .eq('registration_number', registrationNumber)
      .maybeSingle();

    if (error) throw error;
    if (!data) return registrationNumber;
  }

  throw new Error('Unable to allocate a unique registration number');
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { status: false, message: 'Request body must be valid JSON' },
      { status: 400 },
    );
  }

  if (!isRecord(payload)) {
    return NextResponse.json(
      { status: false, message: 'Invalid registration data' },
      { status: 400 },
    );
  }

  const categoryId = readString(payload, 'category_id', 64);
  const fullName = readString(payload, 'full_name', 255);
  const email = readString(payload, 'email', 255)?.toLowerCase();
  const phone = readString(payload, 'phone', 20);
  const dateOfBirth = readString(payload, 'date_of_birth', 10);
  const gender = readString(payload, 'gender', 10);
  const stravaUrl = readString(payload, 'strava_url', 2048);
  const emergencyContactName = readString(payload, 'emergency_contact_name', 255);
  const emergencyContactPhone = readString(payload, 'emergency_contact_phone', 20);
  const emergencyContactRelationship = readString(payload, 'emergency_contact_relationship', 255);
  const instagram = typeof payload.instagram === 'string' ? payload.instagram.trim() : '';
  const medicalConditions = typeof payload.medical_conditions === 'string'
    ? payload.medical_conditions.trim()
    : '';

  if (
    !categoryId || !UUID_PATTERN.test(categoryId) || !fullName
    || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || !phone || !dateOfBirth || !isGender(gender) || !stravaUrl
    || !emergencyContactName || !emergencyContactPhone || !emergencyContactRelationship
    || payload.consent_given !== true
  ) {
    return NextResponse.json(
      { status: false, message: 'Please provide all required registration details and consent' },
      { status: 400 },
    );
  }

  if (!isAtLeast17OnEventDate(dateOfBirth)) {
    return NextResponse.json(
      { status: false, message: 'Participants must be at least 17 years old on the event date' },
      { status: 400 },
    );
  }

  if (!isValidStravaUrl(stravaUrl)) {
    return NextResponse.json(
      { status: false, message: 'Please provide a valid public Strava athlete profile URL' },
      { status: 400 },
    );
  }

  if (instagram.length > 255 || medicalConditions.length > 5000) {
    return NextResponse.json(
      { status: false, message: 'One or more optional fields are too long' },
      { status: 400 },
    );
  }

  try {
    const { data: category, error: categoryError } = await supabaseServer
      .from('syd_categories')
      .select('id, name, price, is_active, max_participants, current_participants')
      .eq('id', categoryId)
      .eq('is_active', true)
      .maybeSingle();

    if (categoryError) throw categoryError;
    if (!category) {
      return NextResponse.json(
        { status: false, message: 'Invalid or inactive category selected' },
        { status: 400 },
      );
    }

    if (
      category.max_participants !== null
      && (category.current_participants ?? 0) >= category.max_participants
    ) {
      return NextResponse.json(
        { status: false, message: 'This category is full. Please select another category.' },
        { status: 409 },
      );
    }

    const { data: existingRegistration, error: duplicateError } = await supabaseServer
      .from(REGISTRATION_TABLE)
      .select('id')
      .eq('email', email)
      .eq('category_id', categoryId)
      .in('payment_status', ['pending', 'paid'])
      .limit(1)
      .maybeSingle();

    if (duplicateError) throw duplicateError;
    if (existingRegistration) {
      return NextResponse.json(
        { status: false, message: 'You have already registered for this event category' },
        { status: 409 },
      );
    }

    const registrationNumber = await generateRegistrationNumber();
    const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const candidateIp = forwardedIp || request.headers.get('x-real-ip')?.trim() || '';
    const ipAddress = isIP(candidateIp) ? candidateIp : null;

    const registrationInput: RegistrationCreateInput = {
      registration_number: registrationNumber,
      category_id: categoryId,
      full_name: fullName,
      email,
      phone,
      date_of_birth: dateOfBirth,
      gender,
      instagram: instagram || null,
      strava_url: stravaUrl,
      emergency_contact_name: emergencyContactName,
      emergency_contact_phone: emergencyContactPhone,
      emergency_contact_relationship: emergencyContactRelationship,
      medical_conditions: medicalConditions || null,
      total_amount: category.price,
      consent_given_at: new Date().toISOString(),
      external_order_id: registrationNumber,
      ip_address: ipAddress,
    };

    const registration = await registrationService.create(registrationInput);

    let payment: Awaited<ReturnType<typeof createSnapTransaction>>;
    try {
      payment = await createSnapTransaction({
        transaction_details: {
          order_id: registrationNumber,
          gross_amount: category.price,
        },
        customer_details: {
          first_name: fullName,
          email,
          phone,
        },
        item_details: [{
          id: category.id,
          price: category.price,
          quantity: 1,
          name: `Share Your Distance - ${category.name}`,
        }],
      });
    } catch (error) {
      console.error('Failed to create Midtrans checkout:', error);
      await registrationService.updatePaymentStatus(registration.id, 'failed');
      return NextResponse.json(
        { status: false, message: 'Unable to start checkout. Please try registering again.' },
        { status: 502 },
      );
    }

    let emailSent = false;
    try {
      await emailService.sendRegistrationConfirmationV2({
        email,
        name: fullName,
        category: category.name,
        registration_number: registrationNumber,
        amount: category.price,
        payment_url: payment.redirect_url,
      });
      emailSent = true;
    } catch (error) {
      console.error('Registration confirmation email failed:', error);
    }

    return NextResponse.json(
      {
        status: true,
        message: 'Registration created successfully',
        email_sent: emailSent,
        data: {
          ...registration,
          category: { name: category.name },
          redirect_url: payment.redirect_url,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { status: false, message: 'Failed to create registration. Please try again or contact support.' },
      { status: 500 },
    );
  }
}
