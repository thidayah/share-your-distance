import { Icon } from "@iconify/react"

interface CategoryFeature {
  feature: string
  display_order: number
}

interface Category {
  id: string
  name: string
  description: string
  price: number
  distance: string
  image_url?: string
  recommended?: boolean
  is_active?: boolean
  max_participants?: number
  current_participants?: number
  min_age?: number
  max_age?: number
  health_warning?: string
  display_order?: number
  category_features: CategoryFeature[]
}

interface CategoriesTableProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  loading: boolean
}

export default function CategoriesTable({ 
  categories, 
  onEdit, 
  onDelete, 
  loading 
}: CategoriesTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price)
  }

  // if (categories.length === 0) {
  //   return (
  //     <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-8 text-center">
  //       <p className="text-zinc-600">No categories found</p>
  //       <p className="text-sm text-zinc-500 mt-2">Create your first category to get started</p>
  //     </div>
  //   )
  // }

  return (
    <div className="bg-white rounded-b-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Distance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Participants
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Age Range
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Show
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zinc-200">
            {loading && (
                <tr>
                  <td colSpan={7} className="bg-white rounded-lg border border-zinc-00 shadow-sm p-8 text-center">
                    <div className="flex justify-center">
                      <Icon icon="svg-spinners:ring-resize" className=" size-8 text-zinc-600" />
                    </div>
                    <p className="mt-4 text-zinc-600">Loading...</p>
                  </td>
                </tr>
              )}
            {!loading && !categories.length && (
              <tr>
                <td colSpan={7} className=" text-center px-6 py-4 whitespace-nowrap text-sm text-zinc-900">No Data</td>
              </tr>
            )}
            {!loading && categories.map((category) => (
              <tr key={category.id} className="hover:bg-zinc-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {category.image_url && (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-zinc-900">
                        {category.name}
                        {category.recommended && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-zinc-500 line-clamp-1">
                        {category.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  {formatPrice(category.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  {category.distance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  {category.current_participants || 0} / {category.max_participants || '∞'}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                  {category.min_age && category.max_age 
                    ? `${category.min_age}-${category.max_age} yrs`
                    : 'Any'
                  }
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    (category.current_participants || 0) < (category.max_participants || Infinity)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {(category.current_participants || 0) < (category.max_participants || Infinity) 
                      ? 'Available' 
                      : 'Full'
                    }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.is_active 
                      ? 'Active' 
                      : 'Inactive'
                    }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <button
                    onClick={() => onEdit(category)}
                    disabled={loading}
                    className="text-zinc-600 hover:text-zinc-900 disabled:opacity-50 cursor-pointer"
                  >
                    <Icon icon="mdi:pencil" className="size-4" />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
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
    </div>
  )
}