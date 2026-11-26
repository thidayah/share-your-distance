import { NextRequest, NextResponse } from 'next/server'
import { registrationService } from '@/lib/supabase/service/registrations/services'
import { RegistrationFilters } from "@/lib/supabase/service/registrations/types"
import { registrationService as registrationServiceEmail } from "@/lib/email/registration-service";
import { PaymentStatus } from '@/lib/supabase/service/registrations/types';
import { getCurrentAdmin } from '@/lib/admin-session'

export async function GET(request: NextRequest) {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const parsePositiveInt = (value: string | null, fallback: number, max: number) => {
      if (!value) return fallback;
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
    };

    const filters: RegistrationFilters = {
      search: searchParams.get('search') || undefined,
      payment_status: searchParams.get('payment_status') || undefined,
      category_id: searchParams.get('category_id') || undefined,
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      page: parsePositiveInt(searchParams.get('page'), 1, 100000),
      limit: parsePositiveInt(searchParams.get('limit'), 10, 1000),
    }

    const result = await registrationService.getAllV2(filters)

    return NextResponse.json(
      {
        success: true,
        message: 'All registrations',
        data: {
          items: result.data,
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
      }
    )

  } catch (error: unknown) {
    console.error('Get registrations error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch registrations',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json();
    const { action, id, ...data } = body;

    if (action !== 'update_payment_status') {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    const statuses: PaymentStatus[] = ['pending', 'paid', 'failed', 'expired', 'refunded', 'cancelled'];
    if (typeof id !== 'string' || !statuses.includes(data.status)) {
      return NextResponse.json(
        { success: false, message: 'A valid registration ID and payment status are required' },
        { status: 400 },
      );
    }

    const previous = await registrationService.getById(id);
    const result = await registrationService.updatePaymentStatusV2(
      id,
      data.status,
      typeof data.paymentDate === 'string' ? data.paymentDate : new Date().toISOString(),
    );

    if (previous.payment_status !== result.payment_status) {
      await registrationService.syncCategoryPaidCount(result.category_id);
    }

    let sendEmail;
    if (previous.payment_status !== 'paid' && result.payment_status === 'paid') {
      sendEmail = await registrationServiceEmail.sendPaymentSuccessV2({
        email: result.email,
        name: result.full_name,
        category: result.category?.name || 'Unknown Category',
        registration_number: result.registration_number,
        amount: result.total_amount,
        payment_date: result.payment_date || new Date().toISOString(),
        payment_method: result.payment_method || 'Admin',
      });
      if (!sendEmail.status) {
        console.error('Failed to send payment success email:', sendEmail.error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment Status Updated',
      data: result,
      sendEmail,
    });

  } catch (error: unknown) {
    console.error('Registration action error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to perform action',
      },
      { status: 500 }
    )
  }
}