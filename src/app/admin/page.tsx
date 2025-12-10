'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { requireAdminAuth } from "@/lib/admin-session"

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isAction, setAction] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const auth = await requireAdminAuth()        
        if (auth) router.push('/admin/dashboard')
      } catch (error) {
        console.error("Error auth check:", error);
      } finally {
        setTimeout(() => {          
          setLoading(false)
        }, 350);
      }
    })();
  }, []);  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAction(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        router.push('/admin/dashboard')
        router.refresh()
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setAction(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-900">Checking authentication...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-sm border border-zinc-200 p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-[-2px]">Share&nbsp;&nbsp;Your&nbsp;&nbsp;Distance</h1>
          <p className="text-zinc-600 mt-2">Admin Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-zinc-700 mb-1">
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 text-zinc-900 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              placeholder="Enter username or email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-zinc-900 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isAction}
            className="w-full bg-zinc-900 text-white py-2 px-4 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAction ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}