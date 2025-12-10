import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createAdminSession } from "@/lib/admin-session"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Authenticate admin user
    const adminUser = await authenticateAdmin(username, password)

    if (!adminUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session menggunakan Supabase Auth (opsional)
    // atau Anda bisa menggunakan session management custom
    // const { data: { session }, error } = await supabaseServer.auth.signInWithPassword({
    //   email: adminUser.email, // atau gunakan email sebagai identifier
    //   password: 'dummy-password' // ini hanya placeholder, actual auth sudah dilakukan di authenticateAdmin
    // })

    await createAdminSession(adminUser.id)

    // Untuk custom session, Anda bisa menggunakan cookies atau JWT
    // Contoh sederhana dengan httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login  successfully',
      data: adminUser,
      // session,
      // error
    })

    return response
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}