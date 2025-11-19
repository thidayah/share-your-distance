// src/app/api/email/registration-confirmation/route.ts
import { registrationService } from "@/lib/email/registration-service";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await registrationService.sendRegistrationConfirmation(body)

    if (!data) {
      // console.error('Email error:', error);
      return NextResponse.json(
        { status: false, message: 'Failed to send email', error: data },
        { status: 500 }
      );
    }

    // console.log('Registration confirmation email sent to:', email);
    return NextResponse.json(
      { status: true, message: 'Email sent successfully', data }
    );

  } catch (error) {
    // console.error('Email API error:', error);
    return NextResponse.json(
      { status: false, message: 'Internal server error', error },
      { status: 500 }
    );
  }
}