import { NextResponse } from 'next/server'
import { registrationService } from '@/lib/supabase/service/registrations/services'
import { getCurrentAdmin } from '@/lib/admin-session'

export async function GET() {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const stats = await registrationService.getStatistics()
    return NextResponse.json({ success: true, message: 'Get Statistics', data: stats })
  } catch (error: unknown) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch statistics',
      },
      { status: 500 }
    )
  }
}