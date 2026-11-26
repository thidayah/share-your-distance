import { NextResponse } from 'next/server';
import { categoryService } from '@/lib/supabase/service/categories/services';

export async function GET() {
  try {
    const data = await categoryService.getActive();
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

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Category management is only available in the admin API' },
    { status: 405 },
  );
}