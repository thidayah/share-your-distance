interface FilterState {
  search: string;
  payment_status: string;
  category_id: string;
  start_date: string;
  end_date: string;
  has_bib: string;
}

interface CategoriesState {
  id: string;
  name: string;
}

interface RegistrationFiltersProps {
  filters: FilterState;
  categories: CategoriesState[];
  onChange: (filters: Partial<FilterState>) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function RegistrationFiltersV2({
  filters,
  categories,
  onChange,
  onSearch,
  onClear
}: RegistrationFiltersProps) {
  const paymentStatuses = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    // { value: 'failed', label: 'Failed' },
    // { value: 'refunded', label: 'Refunded' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          From Date
        </label>
        <input
          type="date"
          value={filters.start_date}
          onChange={(e) => onChange({ start_date: e.target.value })}
          className="w-full px-3 py-2 text-zinc-600 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          To Date
        </label>
        <input
          type="date"
          value={filters.end_date}
          onChange={(e) => onChange({ end_date: e.target.value })}
          className="w-full px-3 py-2 text-zinc-600 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
        />
      </div>

      {/* Payment Status */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Payment Status
        </label>
        <select
          value={filters.payment_status}
          onChange={(e) => onChange({ payment_status: e.target.value })}
          className="w-full px-3 py-2 text-zinc-600 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
        >
          {paymentStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Category
        </label>
        <select
          value={filters.category_id}
          onChange={(e) => onChange({ category_id: e.target.value })}
          className="w-full px-3 py-2 text-zinc-600 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
        >
          <option value={''} defaultValue=''>All Category</option>
          {categories.map(row => (
            <option key={row.id} value={row.id}>
              {row.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      <div className=" md:col-span-3">
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Search
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Name, email, or registration number..."
          className="w-full px-3 py-2 text-zinc-600 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-end gap-2">
        <button
          onClick={onSearch}
          className="flex-1 bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 cursor-pointer"
        >
          Apply
        </button>
        <button
          onClick={onClear}
          className="flex-1 bg-zinc-200 text-zinc-700 px-4 py-2 rounded-md hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  )
}