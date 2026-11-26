import { NextRequest, NextResponse } from 'next/server'
import { categoryService } from '@/lib/supabase/service/categories/services'
import { getCurrentAdmin } from '@/lib/admin-session'

export async function POST(request: NextRequest) {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { category_data, features } = await request.json()

    const requiredFields = ['name', 'description', 'price', 'distance'];

    for (const field of requiredFields) {
      if (!category_data[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (category_data.max_participants < 0) {
      return NextResponse.json(
        { success: false, message: 'Max participants cannot be negative' },
        { status: 400 }
      );
    }

    const newCategory = await categoryService.create(category_data, features)

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: newCategory
    })

  } catch (error: unknown) {
    console.error('Create category error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create category',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!await getCurrentAdmin()) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const categories = await categoryService.getAll()
    return NextResponse.json({ status: true, message: 'All categories', data: categories })
  } catch (error: unknown) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch categories',
      },
      { status: 500 }
    )
  }
}