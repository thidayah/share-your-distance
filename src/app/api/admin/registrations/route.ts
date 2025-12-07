import { NextRequest, NextResponse } from 'next/server'
import { registrationService } from '@/lib/supabase/service/registrations/services'
import { RegistrationFilters } from "@/lib/supabase/service/registrations/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: RegistrationFilters = {
      search: searchParams.get('search') || undefined,
      payment_status: searchParams.get('payment_status') || undefined,
      category_id: searchParams.get('category_id') || undefined,
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      has_bib: searchParams.get('has_bib') ? 
        searchParams.get('has_bib') === 'true' : undefined,
      page: searchParams.get('page') ? 
        parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? 
        parseInt(searchParams.get('limit')!) : 10,
    }

    const result = await registrationService.getAll(filters)

    return NextResponse.json(
      { success: true, message: 'All Participatns', data: result}
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

    switch (action) {
      case 'update_payment_status':
        result = await registrationService.updatePaymentStatus(
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

    return NextResponse.json({ 
      success: true, 
      message: 'Payment Status Updated', 
      data: result 
    });

  } catch (error: any) {
    console.error('Registration action error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to perform action' },
      { status: 500 }
    )
  }
}