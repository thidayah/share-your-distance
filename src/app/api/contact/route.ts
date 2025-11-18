import { NextResponse } from 'next/server';
import { contactMessagesService } from '@/lib/supabase/service/contact-messages/services';
import { contactService } from "@/lib/email/contact-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, category, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message || !category) {
      return NextResponse.json(
        { status: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { status: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert to Supabase database
    const result = await contactMessagesService.create(body);

    // Send emails concurrently
    const adminEmailPromise = await contactService.sendToAdmin(body)
    const userEmailPromise = await contactService.sendToUser(body)

    const [adminResult, userResult] = await Promise.allSettled([
      adminEmailPromise,
      userEmailPromise,
    ]);

    // Logging jika email gagal
    if (adminResult.status === 'rejected')
      console.error('Failed to send admin email:', adminResult.reason);

    if (userResult.status === 'rejected')
      console.error('Failed to send user confirmation:', userResult.reason);

    if (adminResult.status === 'rejected' && userResult.status === 'rejected') {
      throw new Error('Both emails failed to send');
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        email: {
          admin_status: adminResult,
          user_status: userResult
          // admin: adminResult.status === 'fulfilled' ? 'sent' : 'failed',
          // user: userResult.status === 'fulfilled' ? 'sent' : 'failed',
        },
        data: result, // Optional
      },
      { status: 200 }
    );
  } catch (error) {
    // console.error('Contact form error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit contact form, please try again later or contact us directly at hello@shareyourdistance.online',
        error
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await contactMessagesService.getAll();
    return NextResponse.json(
      { success: true, data }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch data', error },
      { status: 500 }
    );
  }
}