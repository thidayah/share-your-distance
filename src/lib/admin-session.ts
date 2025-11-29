'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAdminById } from './admin-auth'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export const createAdminSession = async (adminId: string) => {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    // path: '/admin',
  })
}

export const getAdminSession = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  return sessionCookie?.value || null
}

export const deleteAdminSession = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export const getCurrentAdmin = async (): Promise<any | null> => {
  const sessionId = await getAdminSession()
  if (!sessionId) {
    return null
  }
  const adminUser = await getAdminById(sessionId)
  return adminUser
}

export const requireAdminAuth = async () => {
  const adminUser = await getCurrentAdmin()
  if (!adminUser) {
    redirect('/admin')
  }
  return adminUser
}

export const signOut = async () => {
  await deleteAdminSession()  
  redirect('/admin')
}