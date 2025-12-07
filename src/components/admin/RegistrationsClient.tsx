'use client'

import { useState, useEffect } from 'react'
import RegistrationTable from './RegistrationTable'
import RegistrationFilters from './RegistrationFilters'
import RegistrationStats from './RegistrationStats'
import { Registration } from "@/lib/supabase/service/registrations/types"

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

export default function RegistrationsClient() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [categories, setCategories] = useState<CategoriesState[]>([])
  const [loading, setLoading] = useState(true)
  const [clear, setClear] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    failed: 0,
    refunded: 0,
    cancelled: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
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

      const response = await fetch(`/api/admin/registrations?${queryParams}`)
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
      const response = await fetch('/api/admin/registrations/stats')
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
      limit: 20,
    })
    setClear(true)
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/registrations', {
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

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900">Registrations</h1>
      </div> */}

      {/* <RegistrationStats stats={stats} /> */}

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-900">Manage Registrations</h2>
        </div>

        <RegistrationFilters
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClearFilters}
        />

        <RegistrationTable
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