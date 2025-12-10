'use client'

import { Registration } from "@/lib/supabase/service/registrations/types";
import { Icon } from '@iconify/react'

// interface Registration {
//   id: string;
//   registration_number: string;
//   category_id: string;
//   full_name: string;
//   email: string;
//   phone: string;
//   date_of_birth: string;
//   gender: 'male' | 'female' | 'other';
//   nationality: string;
//   id_number?: string;
//   tshirt_size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
//   running_experience?: string;
//   emergency_contact_name: string;
//   emergency_contact_phone: string;
//   emergency_contact_relationship: string;
//   medical_conditions?: string;
//   total_amount: number;
//   payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
//   payment_method?: string;
//   payment_date?: string;
//   external_payment_id?: string;
//   bib_number?: string;
//   bib_assigned_at?: string;
//   finish_time?: string;
//   agreed_to_terms: boolean;
//   agreed_to_privacy_policy: boolean;
//   agreed_at: string;
//   created_at: string;
//   updated_at: string;
//   ip_address?: string;
//   category?: {
//     name: string;
//     distance: string;
//   };
// }

interface RegistrationDetailsModalProps {
  registration: Registration;
  onClose: () => void;
}

export default function RegistrationDetailsModal({ registration, onClose }: RegistrationDetailsModalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit'
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

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg max-w-4xl w-full my-8">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Registration Details
            </h2>
            <p className="text-sm text-zinc-600">
              {registration.registration_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700"
          >
            <Icon icon="mdi:close" className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-250px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Personal Information */}
            <div className="space-y-6">
              {/* Participant Info */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
                  <Icon icon="mdi:account-details" className="h-5 w-5 mr-2" />
                  Participant Information
                </h3>
                <div className="bg-zinc-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center">
                    <div>
                      <div className="text-lg font-semibold text-zinc-900">{registration.full_name} <span className="text-sm font-medium text-zinc-500 capitalize">({calculateAge(registration.date_of_birth)} years)</span></div>
                      {/* <div className="text-sm text-zinc-500 capitalize">{registration.gender}, {calculateAge(registration.date_of_birth)} years</div> */}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Date of Birth</div>
                      <div className="text-sm text-zinc-500 font-medium">{formatDate(registration.date_of_birth)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Gender</div>
                      <div className="text-sm text-zinc-500 font-medium capitalize">{registration.gender}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Nationality</div>
                      <div className="text-sm text-zinc-500 font-medium">{registration.nationality}</div>
                    </div>
                    {registration.id_number && (
                      <div>
                        <div className="text-xs text-zinc-900 font-semibold">ID Number (KTP)</div>
                        <div className="text-sm text-zinc-500 font-medium">{registration.id_number}</div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Email</div>
                      <div className="text-sm text-zinc-500 font-medium break-all">{registration.email}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Phone</div>
                      <div className="text-sm text-zinc-500 font-medium">{registration.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Race Preferences */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
                  <Icon icon="mdi:run" className="h-5 w-5 mr-2" />
                  Race Preferences
                </h3>
                <div className="bg-zinc-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">T-Shirt Size</div>
                      <div className="text-sm text-zinc-500 font-medium">
                        {registration.tshirt_size || 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Running Experience</div>
                      <div className="text-sm text-zinc-500 font-medium">
                        {registration.running_experience || 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              {registration.medical_conditions && (
                <div>
                  <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
                    <Icon icon="mdi:medical-bag" className="h-5 w-5 mr-2" />
                    Medical Information
                  </h3>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="text-sm font-medium text-red-800">{registration.medical_conditions}</div>
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
                  <Icon icon="mdi:phone-alert" className="h-5 w-5 mr-2" />
                  Emergency Contact
                </h3>
                <div className="bg-zinc-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">Name</div>
                      <div className="text-xs text-zinc-500 font-medium">{registration.emergency_contact_name} ({registration.emergency_contact_relationship})</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">Phone Number</div>
                      <div className="text-sm text-zinc-500 font-medium">{registration.emergency_contact_phone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Registration & Payment */}
            <div className="space-y-6">
              {/* Registration Details */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
                  <Icon icon="mdi:clipboard-text" className="h-5 w-5 mr-2" />
                  Registration Details
                </h3>
                <div className="bg-zinc-50 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-xs text-zinc-900 font-semibold">Category</div>
                    <div className="text-sm text-zinc-500 font-medium">
                      {registration.category?.name || 'N/A'} • {registration.category?.distance || 'N/A'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Registration Date</div>
                      <div className="text-sm text-zinc-500 font-medium">{formatDate(registration.created_at)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Last Updated</div>
                      <div className="text-sm text-zinc-500 font-medium">{formatDate(registration.updated_at)}</div>
                    </div>
                  </div>

                  {registration.ip_address && (
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">IP Address</div>
                      <div className="text-sm text-zinc-500 font-medium font-mono">{registration.ip_address}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
                  <Icon icon="mdi:cash" className="h-5 w-5 mr-2" />
                  Payment Information
                </h3>
                <div className="bg-zinc-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Amount</div>
                      <div className="text-lg font-bold text-zinc-900">{formatCurrency(registration.total_amount)}</div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(registration.payment_status)}`}>
                      {registration.payment_status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Payment Method</div>
                      <div className="text-sm text-zinc-500 font-medium">{registration.payment_method || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Payment Date</div>
                      <div className="text-sm text-zinc-500 font-medium">{formatDate(registration.payment_date)}</div>
                    </div>
                  </div>

                  {registration.external_payment_id && (
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Payment Gateway ID</div>
                      <div className="text-sm text-zinc-500 font-medium font-mono">{registration.external_payment_id}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bib & Finish Information */}
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-4 flex items-center">
                  <Icon icon="mdi:racing-helmet" className="h-5 w-5 mr-2" />
                  Race Information
                </h3>
                <div className="bg-zinc-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Bib Number</div>
                      <div className="text-sm text-zinc-500 font-medium">
                        {registration.bib_number ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                            <Icon icon="mdi:numeric" className="h-4 w-4 mr-1" />
                            {registration.bib_number}
                          </span>
                        ) : 'Not assigned'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-900 font-semibold">Assigned</div>
                      <div className="text-sm text-zinc-500 font-medium">
                        {formatDate(registration.bib_assigned_at) || '-'}
                      </div>
                    </div>
                    {/* <div>
                      <div className="text-xs text-zinc-900 font-semibold">Finish Time</div>
                      <div className="text-sm font-medium">
                        {registration.finish_time ? formatDate(registration.finish_time) : 'Not recorded'}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* Terms Agreement */}
          <div className="mt-8 pt-6 border-t border-zinc-200">
            <h3 className="text-lg font-medium text-zinc-900 mb-4">Terms Agreement <span className="text-xs font-normal text-zinc-500 mt-2"> (Agreed at: {formatDate(registration.agreed_at)})</span></h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Icon
                  icon={registration.agreed_to_terms ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}
                  className={`h-5 w-5 mr-2 ${registration.agreed_to_terms ? 'text-green-600' : 'text-zinc-400'}`}
                />
                <span className="text-sm text-zinc-500">Agreed to Terms & Conditions</span>
              </div>
              <div className="flex items-center">
                <Icon
                  icon={registration.agreed_to_privacy_policy ? "mdi:checkbox-marked-circle" : "mdi:checkbox-blank-circle-outline"}
                  className={`h-5 w-5 mr-2 ${registration.agreed_to_privacy_policy ? 'text-green-600' : 'text-zinc-400'}`}
                />
                <span className="text-sm text-zinc-500">Agreed to Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-700 bg-zinc-100 rounded-md hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 cursor-pointer"
          >
            Print Details
          </button>
        </div>
      </div>
    </div>
  )
}