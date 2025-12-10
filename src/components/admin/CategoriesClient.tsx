'use client'

import { useEffect, useState } from 'react'
import { CategoryCreate } from '@/lib/supabase/service/categories/types'
import CategoriesTable from './CategoriesTable'
import CategoryModal from './CategoryModal'
import { toast } from "react-toastify"

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

// interface CategoriesClientProps {
//   initialCategories: Category[]
// }

// export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  // const [categories, setCategories] = useState<Category[]>(initialCategories)
export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([])  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState(false)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/categories`)
      const result = await response.json()
      if (response.ok) {
        setCategories(result.data || [])
        // setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])  

  // Create new category via API
  const handleCreate = async (categoryData: CategoryCreate, features: string[]) => {
    setAction(true)
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_data: categoryData, features }),
      })

      const result = await response.json()
      // if (!response.ok) {
      //   throw new Error(result.error)
      // }
      if (result.success) {
        toast.success(result.message || 'Data created successfully')
        setCategories(prev => [...prev, result.data])
        setIsModalOpen(false)
      } else {
        toast.warning(result.message || 'Error creating')
      }
    } catch (error: any) {
      console.error('Error creating:', error)
      toast.error(error.message || 'Error creating')
    } finally {
      setAction(false)
    }
  }

  // Update category via API
  const handleUpdate = async (id: string, updates: Partial<CategoryCreate>, features: string[]) => {
    setAction(true)
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_data: updates, features }),
      })
      const result = await response.json()
      // if (!response.ok) {
      //   throw new Error(result.error)
      // }
      if (result.success) {        
        toast.success(result.message || 'Data updated successfully')
          setCategories(prev =>
          prev.map(cat => cat.id === id ? { ...cat, ...result.category } : cat)
        )
        setIsModalOpen(false)
        setEditingCategory(null)
      } else {
        toast.warning(result.message || 'Error updating')
      }      
    } catch (error: any) {
      console.error('Error updating:', error)
      toast.error(error.message || 'Error updating')
    } finally {
      setAction(false)
    }
  }

  // Delete category via API
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    setAction(true)
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      // if (!response.ok) {
      //   throw new Error(result.error)
      // }
      if (result.success) {
        toast.success(result.message || 'Data deleted')
        setCategories(prev => prev.filter(cat => cat.id !== id))
      } else {
        toast.warning(result.message || 'Error deleting')
      }
    } catch (error: any) {
      console.error('Error deleting:', error)
      toast.error(error.message || 'Error deleting')
    } finally {
      setAction(false)
    }
  }

  // Refresh categories from API
  // const refreshCategories = async () => {
  //   try {
  //     const response = await fetch('/api/admin/categories')
  //     const result = await response.json()

  //     if (response.ok) {
  //       setCategories(result.data)
  //     }
  //   } catch (error) {
  //     console.error('Error refreshing categories:', error)
  //   }
  // }

  // Open modal for create
  const openCreateModal = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  // Open modal for edit
  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900">Categories</h1>
      </div> */}

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
        <div className="p-6 border-b border-zinc-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-900">Manage Categories</h2>
          <div className="flex gap-3">
            {/* <button
              onClick={refreshCategories}
              className="bg-zinc-200 text-zinc-700 px-4 py-2 rounded-md hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
            >
              Refresh
            </button> */}
            <button
              onClick={openCreateModal}
              className="bg-zinc-900 text-white px-4 py-1.5 rounded-md hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 cursor-pointer"
            >
              + Create
            </button>
          </div>
        </div>
        <CategoriesTable
          categories={categories}
          onEdit={openEditModal}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onSubmit={editingCategory ?
            (data, features) => handleUpdate(editingCategory.id, data, features) :
            handleCreate
          }
          onClose={closeModal}
          loading={action}
        />
      )}
    </div>
  )
}