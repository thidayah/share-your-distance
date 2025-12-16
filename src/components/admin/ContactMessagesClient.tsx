'use client'
import { useEffect, useState } from 'react'
import ContactMessagesTable from "./ContactMessagesTable"
import { toast } from "react-toastify"

export default function ContactMessagesClient() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  const [filters, setFilters] = useState<{ page: number, limit: number }>({
    page: 1,
    limit: 10
  })

  useEffect(() => {
    fetchContactMessages()
  }, [filters.page, filters.limit])

  const fetchContactMessages = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value.toString())
        }
      })
      const response = await fetch(`/api/admin/contacts?${queryParams}`)
      if (response.ok) {
        const result = await response.json()
        setMessages(result.data.items || [])
        // setMessages([])
        setPagination({
          page: result.data.page,
          limit: result.data.limit,
          total: result.data.total,
          totalPages: result.data.totalPages
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        toast.success(result.message || 'Data deleted')
        setMessages(prev => prev.filter((row: { id: string }) => row.id !== id))
      } else {
        toast.warning(result.message || 'Error deleting')
      }
    } catch (error: any) {
      console.error('Error deleting:', error)
      toast.error(error.message || 'Error deleting')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
        <div className="p-4 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-900">Manage Contact Messages</h2>
        </div>
        <ContactMessagesTable
          messages={messages}
          pagination={pagination}
          onPageChange={handlePageChange}
          // onEdit={openEditModal}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  )
}
