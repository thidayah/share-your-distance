'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { signOut } from '@/lib/auth'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Registration', href: '/admin/registration', icon: '👥' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-zinc-200 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-900">Admin Panel</h1>
        <p className="text-sm text-zinc-600">Share Your Distance</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8">
        <button
          // onClick={() => signOut()}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors"
        >
          <span className="mr-3">🚪</span>
          Sign Out
        </button>
      </div>
    </div>
  )
}