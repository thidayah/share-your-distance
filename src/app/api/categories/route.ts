import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/supabase/service/categories/services';

export async function GET() {
  try {
    const data = await categoryService.getAll();
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = await categoryService.create(body.category, body.features);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create category', error }, 
      { status: 500 },
    );
  }
}