import { NextRequest, NextResponse } from 'next/server'
import { categoryService } from '@/lib/supabase/service/categories/services'

export async function POST(request: NextRequest) {
  try {
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

    if(category_data.max_participants <= 0) {
      return NextResponse.json(
        { success: false, message: 'Max participants cannot be negative' },
        { status: 400 }
      );
    }

    if ((category_data.max_age || category_data.max_age === 0) && (category_data.max_age < category_data.min_age)) {
      return NextResponse.json(
        { success: false, message: `Age range no valid` },
        { status: 400 }
      );
    }

    const newCategory = await categoryService.create(category_data, features)

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      data: newCategory
    })

  } catch (error: any) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const categories = await categoryService.getAll()
    return NextResponse.json({ status: true, message: 'All categories', data: categories })
  } catch (error: any) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}