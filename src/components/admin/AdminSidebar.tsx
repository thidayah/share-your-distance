'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from "@/lib/admin-session"
import { Icon } from "@iconify/react"

const navigation = [
  // { name: 'Dashboard', href: '/admin/dashboard', icon: <Icon icon="mdi:chart-box" className="size-5"/> },
  // { name: 'Registrations', href: '/admin/registrations', icon: <Icon icon="mdi:account-multiple" className="size-5"/> },
  { name: 'Dashboard', href: '/admin/dashboard-v2', icon: <Icon icon="mdi:chart-box" className="size-5"/> },
  { name: 'Registrations', href: '/admin/registrations-v2', icon: <Icon icon="mdi:account-multiple" className="size-5"/> },
  { name: 'Categories', href: '/admin/categories', icon: <Icon icon="mdi:category-plus-outline" className="size-5"/> },
  { name: 'Messages', href: '/admin/contact-messages', icon: <Icon icon="mdi:email-mark-as-unread" className="size-5"/> },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-zinc-200 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-[-2px]">Share&nbsp;&nbsp;Your&nbsp;&nbsp;Distance</h1>
        <p className="text-sm text-zinc-600">Admin Panel</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
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
          onClick={signOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-md transition-colors"
        >
          <Icon icon="mdi:logout" className="mr-3 size-5" />
          Logout
        </button>
      </div>
    </div>
  )
}