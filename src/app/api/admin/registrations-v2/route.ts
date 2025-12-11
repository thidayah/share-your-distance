import { NextRequest, NextResponse } from 'next/server'
import { registrationService } from '@/lib/supabase/service/registrations/services'
import { RegistrationFilters } from "@/lib/supabase/service/registrations/types"
import { registrationService as registrationServiceEmail } from "@/lib/email/registration-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: RegistrationFilters = {
      search: searchParams.get('search') || undefined,
      payment_status: searchParams.get('payment_status') || undefined,
      category_id: searchParams.get('category_id') || undefined,
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      page: searchParams.get('page') ?
        parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ?
        parseInt(searchParams.get('limit')!) : 10,
    }

    const result = await registrationService.getAllV2(filters)

    return NextResponse.json(
      { success: true, message: 'All Participatns V2', data: result }
    )

  } catch (error: any) {
    console.error('Get registrations error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...data } = body;

    let result;

    data.paymentDate = data.paymentDate || new Date().toISOString()

    switch (action) {
      case 'update_payment_status':
        result = await registrationService.updatePaymentStatusV2(
          id,
          data.status,
          data.paymentDate
        );
        break;

      // case 'assign_bib':
      //   result = await registrationService.assignBibNumber(id, data.bibNumber);
      //   break;

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        );
    }

    let sendEmail;

    if (result && data.status === 'paid') {
      // Send email payment successfully
      const emailForm = {
        email: result.email,
        name: result.full_name,
        category: result.category?.name || 'Unknown Category',
        registration_number: result.unique_code,
        bib_number: '',
        amount: parseFloat(result.total_amount),
        payment_date: result.payment_date!,
        payment_method: 'QRIS',
      };

      sendEmail = await registrationServiceEmail.sendPaymentSuccessV2(emailForm);

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

  } catch (error: any) {
    console.error('Registration action error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to perform action' },
      { status: 500 }
    )
  }
}