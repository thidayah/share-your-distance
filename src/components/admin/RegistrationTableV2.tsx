'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Registration } from "@/lib/supabase/service/registrations/types";
import RegistrationDetailsModalV2 from "./RegistrationDetailsModalV2";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface RegistrationsTableProps {
  registrations: Registration[];
  loading: boolean;
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export default function RegistrationsTableV2({
  registrations,
  loading,
  pagination,
  onPageChange,
  onUpdateStatus,
}: RegistrationsTableProps) {
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return 'mdi:check-circle'
      case 'pending': return 'mdi:clock-outline'
      case 'failed': return 'mdi:close-circle'
      case 'refunded': return 'mdi:cash-refund'
      case 'cancelled': return 'mdi:cancel'
      default: return 'mdi:help-circle'
    }
  }

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration)
    setShowDetailsModal(true)
  }

  const handleUpdateStatus = (id: string, status: string) => {
    if (confirm(`Change payment status to ${status}?`)) {
      onUpdateStatus(id, status)
    }
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: 'mdi:clock-outline', color: 'text-yellow-600' },
    { value: 'paid', label: 'Paid', icon: 'mdi:check-circle', color: 'text-green-600' },
    // { value: 'failed', label: 'Failed', icon: 'mdi:close-circle', color: 'text-red-600' },
    // { value: 'refunded', label: 'Refunded', icon: 'mdi:cash-refund', color: 'text-blue-600' },
    { value: 'cancelled', label: 'Cancelled', icon: 'mdi:cancel', color: 'text-gray-600' }
  ]

  return (
    <>
      <div className="bg-white rounded-b-lg border-t border-zinc-200 shadow-sm overflow-hidden">
        <div className="pb-40 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Payment
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Bib Number
                </th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Registered
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-zinc-200">
              {loading && (
                <tr>
                  <td colSpan={6} className="bg-white rounded-lg border border-zinc-00 shadow-sm p-8 text-center">
                    <div className="flex justify-center">
                      <Icon icon="svg-spinners:ring-resize" className=" size-8 text-zinc-600" />
                    </div>
                    <p className="mt-4 text-zinc-600">Loading...</p>
                  </td>
                </tr>
              )}
              {!loading && registrations.length === 0 && (
                <tr>
                  <td colSpan={6} className=" text-center py-4 text-sm text-zinc-600">No Data</td>
                </tr>
              )}
              {!loading && registrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-zinc-50">
                  {/* Registration Number */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-zinc-900">
                      {registration.unique_code}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {/* ID: {registration.id.substring(0, 8)}... */}
                      {formatDate(registration.created_at)}
                    </div>
                  </td>

                  {/* Participant Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center">
                        <Icon
                          icon={registration.gender === 'female' ? 'mdi:face-woman' :
                            registration.gender === 'male' ? 'mdi:face-man' : 'mdi:account'}
                          className="h-6 w-6 text-zinc-600"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-zinc-900">
                          {registration.full_name}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {/* {calculateAge(registration.date_of_birth)} yrs • {registration.nationality} */}
                          {calculateAge(registration.date_of_birth)} yrs • {registration.email}
                        </div>
                        {/* <div className="text-xs text-zinc-400">
                          {registration.email}
                        </div> */}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {registration.category ? (
                      <>
                        <div className="text-sm font-medium text-zinc-900">
                          {registration.category.name}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {registration.category.distance}
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-zinc-400">No category</span>
                    )}
                  </td>

                  {/* Payment Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Icon
                        icon={getPaymentStatusIcon(registration.payment_status)}
                        className={`h-5 w-5 mr-2 ${getPaymentStatusColor(registration.payment_status).split(' ')[1]}`}
                      />
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(registration.payment_status)}`}>
                        {registration.payment_status.toUpperCase()}
                      </span>
                      {registration.payment_date && (
                        <div className="text-xs text-zinc-500">
                          &nbsp; {formatDate(registration.payment_date)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-zinc-900 mt-1">
                      {formatCurrency(registration.total_amount)}
                    </div>
                  </td>

                  {/* Bib Number */}
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    {registration.bib_number ? (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Icon icon="mdi:numeric" className="h-4 w-4 mr-1" />
                        {registration.bib_number}
                      </div>
                    ) : (
                      <span className="text-sm text-zinc-400">Not assigned</span>
                    )}
                  </td> */}

                  {/* Registration Date */}
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {formatDate(registration.created_at)}
                  </td> */}

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {/* View Details */}
                      <button
                        onClick={() => handleViewDetails(registration)}
                        className="text-zinc-600 hover:text-zinc-900 cursor-pointer"
                        title="View Details"
                      >
                        <Icon icon="mdi:eye" className="h-5 w-5" />
                      </button>

                      {/* Status Dropdown */}
                      <div className="relative group ">
                        <button className="text-zinc-600 hover:text-zinc-900 cursor-pointer">
                          <Icon icon="mdi:credit-card-check" className="h-5 w-5" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-999999 border border-zinc-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 cursor-pointer">
                          <div className="py-1">
                            <div className="px-4 py-2 text-xs text-zinc-500 border-b">
                              Update Status
                            </div>
                            {statusOptions.map(option => (
                              <button
                                key={option.value}
                                onClick={() => handleUpdateStatus(registration.id, option.value)}
                                className={`flex items-center w-full text-zinc-600 px-4 py-2 text-sm hover:bg-zinc-100 cursor-pointer ${registration.payment_status === option.value ? 'bg-zinc-50' : ''}`}
                              >
                                <Icon icon={option.icon} className={`h-4 w-4 mr-2 ${option.color}`} />
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Export/More Options */}
                      {/* <div className="relative group">
                        <button className="text-zinc-600 hover:text-zinc-900">
                          <Icon icon="mdi:dots-vertical" className="h-5 w-5" />
                        </button>
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-zinc-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <div className="py-1">
                            <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                              <Icon icon="mdi:printer" className="h-4 w-4 mr-2" />
                              Print
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                              <Icon icon="mdi:email" className="h-4 w-4 mr-2" />
                              Email
                            </button>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-center justify-between">
              <div className="text-sm text-zinc-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of{' '}
                <span className="font-medium">{pagination.total}</span> registrations
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm text-zinc-900 border border-zinc-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-3 py-1 text-sm rounded-md ${pagination.page === pageNum
                          ? 'bg-zinc-900 text-white'
                          : 'border text-zinc-500 border-zinc-300 hover:bg-zinc-100 cursor-pointer'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 text-sm text-zinc-900 border border-zinc-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Registration Details Modal */}
      {showDetailsModal && selectedRegistration && (
        <RegistrationDetailsModalV2
          registration={selectedRegistration}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  )
}