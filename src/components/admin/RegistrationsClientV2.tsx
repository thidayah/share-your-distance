'use client'

import { useState, useEffect } from 'react'
import { Registration } from "@/lib/supabase/service/registrations/types"
import RegistrationFiltersV2 from "./RegistrationFiltersV2"
import RegistrationsTableV2 from "./RegistrationTableV2"
import { normalizePhone } from "@/utils"

interface FilterState {
  search: string;
  payment_status: string;
  category_id: string;
  start_date: string;
  end_date: string;
  has_bib: string;
  page: number;
  limit: number;
}

interface CategoriesState {
  id: string;
  name: string;
}

export default function RegistrationsClientV2() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [categories, setCategories] = useState<CategoriesState[]>([])
  const [loading, setLoading] = useState(true)
  const [clear, setClear] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    // failed: 0,
    // refunded: 0,
    cancelled: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    payment_status: '',
    category_id: '',
    start_date: '',
    end_date: '',
    has_bib: '',
    page: 1,
    limit: 10
  })

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()

      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          queryParams.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/admin/registrations-v2?${queryParams}`)
      const result = await response.json()

      if (response.ok) {
        setRegistrations(result.data.items || [])
        // setRegistrations([])
        setPagination({
          page: result.data.page,
          limit: result.data.limit,
          total: result.data.total,
          totalPages: result.data.totalPages
        })
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
    } finally {
      setLoading(false)
      setClear(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/registrations-v2/stats')
      if (response.ok) {
        const result = await response.json()
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const result = await response.json()
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchExport = async () => {
    try {
      const response = await fetch(`/api/admin/registrations-v2?limit=1000`)
      const result = await response.json()
      if (response.ok) {
        exportToCSV(result.data.items || [])
      }
    } catch (error) {
      console.error('Error fetching export:', error)
    }
  }

  useEffect(() => {
    fetchRegistrations()
    fetchStats()
    fetchCategories()
  }, [filters.page, filters.limit])

  useEffect(() => {
    if (clear) {
      fetchRegistrations()
    }
  }, [clear])

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  const handleSearch = () => {
    fetchRegistrations()
  }

  const handleClearFilters = async () => {
    setFilters({
      search: '',
      payment_status: '',
      category_id: '',
      start_date: '',
      end_date: '',
      has_bib: '',
      page: 1,
      limit: 10,
    })
    setClear(true)
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/registrations-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_payment_status',
          id,
          status
        })
      })

      if (response.ok) {
        fetchRegistrations() // Refresh data
        fetchStats() // Refresh stats
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToCSV = (data: Registration[]) => {
    // Simple CSV export
    const headers = [
      'Unique Code',
      'Full Name',
      'Email',
      'Phone',
      'Age',
      'Gender',
      'Event',
      'Registration Date',
      'Payment Status',
      'Payment Amount',
      'Payment Date',
      'Emergency Contact',
      'Emergency Phone',
      'Emergency Relationship'
    ]

    const rows = data.map(p => [
      p.unique_code,
      p.full_name,
      p.email,
      normalizePhone(p.phone),
      calculateAge(p.date_of_birth),
      p.gender.charAt(0).toUpperCase() + p.gender.slice(1),
      p.category?.name || '',
      formatDateTime(p.created_at),
      p.payment_status.toUpperCase(),
      p.total_amount,
      p.payment_date ? formatDateTime(p.payment_date) : '',
      p.emergency_contact_name || '',
      normalizePhone(p.emergency_contact_phone) || '',
      p.emergency_contact_relationship || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/xls' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Registrations_${new Date().toISOString().split('T')[0]}.xls`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900">Registrations</h1>
      </div> */}

      {/* <RegistrationStats stats={stats} /> */}

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
        <div className="p-4 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-900">Manage Registrations</h2>
          <div>
            <button
              onClick={fetchExport}
              className="flex-1 bg-white text-zinc-900 border border-zinc-900 px-4 py-2 rounded-md hover:bg-zinc-100 focus:outline-none transition focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 cursor-pointer"
            >
              Export CSV
            </button>
          </div>
        </div>

        <RegistrationFiltersV2
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />

        <RegistrationsTableV2
          registrations={registrations}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  )
}