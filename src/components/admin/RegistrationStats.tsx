interface StatsProps {
  stats: {
    total: number
    pending: number
    paid: number
    failed: number
    refunded: number
    cancelled: number
  }
}

export default function RegistrationStats({ stats }: StatsProps) {
  const percentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0'
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-zinc-900 mb-4">Registration Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
          <div className="text-sm text-blue-700">Total Registrations</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-900">{stats.paid}</div>
          <div className="text-sm text-green-700">
            Paid ({percentage(stats.paid, stats.total)}%)
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
          <div className="text-sm text-yellow-700">
            Pending ({percentage(stats.pending, stats.total)}%)
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-900">{stats.failed}</div>
          <div className="text-sm text-red-700">
            Failed ({percentage(stats.failed, stats.total)}%)
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-900">{stats.refunded}</div>
          <div className="text-sm text-blue-700">
            Refunded ({percentage(stats.refunded, stats.total)}%)
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-200 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{stats.cancelled}</div>
          <div className="text-sm text-gray-700">
            Cancelled ({percentage(stats.cancelled, stats.total)}%)
          </div>
        </div>
      </div>
    </div>
  )
}