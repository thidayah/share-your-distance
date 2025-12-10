import { NextResponse } from 'next/server'
import { registrationService } from '@/lib/supabase/service/registrations/services'

export async function GET() {
  try {
    const stats = await registrationService.getStatistics()
    return NextResponse.json({ success: true, message: 'Get Statistics', data: stats })
  } catch (error: any) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}