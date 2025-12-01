import { categoryService } from "@/lib/supabase/service/categories/services"
import { NextRequest, NextResponse } from 'next/server'

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params    

    // // Validasi ID
    // if (!id || id === 'undefined' || id === 'null') {
    //   return NextResponse.json(
    //     { success: false, error: 'Valid category ID is required' },
    //     { status: 400 }
    //   )
    // }

    const category = await categoryService.getById(id)

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Category detail successfully', data: category }
    )

  } catch (error: any) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch category' },
      { status: 500 }
    )
  }
}


export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params
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

    if (category_data.max_age && (category_data.max_age < category_data.min_age)) {
      return NextResponse.json(
        { success: false, message: `Age range no valid` },
        { status: 400 }
      );
    }

    const updatedCategory = await categoryService.update(id, category_data, features)

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    })

  } catch (error: any) {
    console.error('Update category error:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params

    await categoryService.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: 500 }
    )
  }
}