import { contactMessagesService } from "@/lib/supabase/service/contact-messages/services"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: { page?: number, limit?: number } = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    }
    const data = await contactMessagesService.getAllPagination(filters)
    return NextResponse.json({ status: true, message: 'All contact messages', data: data })
  } catch (error: any) {
    console.error('Get contacts messages error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch contacts messages' },
      { status: 500 }
    )
  }
}