import { supabaseServer } from '@/lib/supabase/server-client'
import { verifyPassword } from "@/utils"

export interface AdminUser {
  id: string
  name: string
  username: string
  email: string
  created_at: string
  updated_at: string
}

export const authenticateAdmin = async (username: string, password: string): Promise<AdminUser | null> => {
  try {
    // Search admin user by username / email
    const { data: adminUser, error } = await supabaseServer
      .from('admin_users')
      .select('*')
      .or(`username.eq.${username},email.eq.${username}`)
      .single()

    if (error || !adminUser) {
      console.error('Admin user not found:', error)
      return null
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, adminUser.password_hash)
    if (!isValidPassword) {
      console.error('Invalid password')
      return null
    }

    // Update last login
    await supabaseServer
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUser.id)

    // Return admin user data without password_hash
    const { password_hash, ...adminData } = adminUser
    return adminData as AdminUser
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export const getAdminById = async (id: string): Promise<AdminUser | null> => {
  try {
    const { data: adminUser, error } = await supabaseServer
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !adminUser) {
      return null
    }

    const { password_hash, ...adminData } = adminUser
    return adminData as AdminUser
  } catch (error) {
    console.error('Error fetching admin:', error)
    return null
  }
}

export const getAllAdmins = async (): Promise<AdminUser[]> => {
  try {
    const { data: adminUsers, error } = await supabaseServer
      .from('admin_users')
      .select('id, name, username, email, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admins:', error)
      return []
    }

    return adminUsers as AdminUser[]
  } catch (error) {
    console.error('Error fetching admins:', error)
    return []
  }
}