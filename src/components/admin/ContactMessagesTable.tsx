import { Icon } from "@iconify/react"

interface ContactMessage {
  id: string
  name: string
  email: string
  category: string
  subject: string
  message: string
  created_at: string
  is_read: boolean
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ContactMessagesTableProps {
  messages: ContactMessage[]
  pagination: Pagination
  onPageChange: (page: number) => void
  // onEdit: (category: ContactMessage) => void
  onDelete: (id: string) => void
  loading: boolean
}

export default function ContactMessagesTable({
  messages,
  pagination,
  onPageChange,
  // onEdit,
  onDelete,
  loading
}: ContactMessagesTableProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-white rounded-b-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Sender
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Email
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Send
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </th>
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
            {!messages.length && (
              <tr>
                <td colSpan={8} className=" text-center px-6 py-4 whitespace-nowrap text-sm text-zinc-900">No Data</td>
              </tr>
            )}
            {!loading && messages.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  <div>
                    <div className="text-sm font-medium text-zinc-900">
                      {row.name}
                    </div>
                    <div className="text-sm text-zinc-500 line-clamp-1">
                      {row.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  <div>
                    <div className="text-sm font-medium text-zinc-900">
                      {row.category}
                    </div>
                    <div className="text-sm text-zinc-500 line-clamp-1">
                      Subject: {row.subject}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900 max-w-80">
                  {row.message}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900 ">
                  {formatDate(row.created_at)}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-900 max-w-80">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(row.is_read)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {(row.is_read)
                      ? 'Yes'
                      : 'Unread'
                    }
                  </span>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  {category.current_participants || 0} / {category.max_participants || '∞'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(category.current_participants || 0) < (category.max_participants || Infinity)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {(category.current_participants || 0) < (category.max_participants || Infinity)
                      ? 'Available'
                      : 'Full'
                    }
                  </span>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4" >
                  {/* <button
                    onClick={() => onEdit(row)}
                    disabled={loading}
                    className="text-zinc-600 hover:text-zinc-900 disabled:opacity-50 cursor-pointer"
                  >
                    <Icon icon="mdi:pencil" className="size-4" />
                  </button> */}
                  <button
                    onClick={() => onDelete(row.id)}
                    disabled={loading}
                    className="text-zinc-600 hover:text-zinc-900 disabled:opacity-50 cursor-pointer"
                  >
                    <Icon icon="mdi:trash" className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          <div className="flex items-center justify-between">
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
  )
}