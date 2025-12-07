import { contactMessagesService } from "@/lib/supabase/service/contact-messages/services";
import { NextRequest, NextResponse } from "next/server";

interface Context {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
    const { is_read } = await request.json()

    const result = await contactMessagesService.update(id, { is_read })

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact Message Status Updated',
      data: result
    })

  } catch (error: any) {
    console.error('Update contact message error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update contact message' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params

    await contactMessagesService.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully'
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete contact message' },
      { status: 500 }
    )
  }
}