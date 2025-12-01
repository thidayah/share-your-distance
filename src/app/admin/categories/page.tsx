// import { categoryService } from '@/lib/supabase/service/categories/services'
import CategoriesClient from '@/components/admin/CategoriesClient'
import AdminTemplate from "@/components/admin/AdminTemplate"

export default async function CategoriesPage() {
  // Fetch categories data on server
  const getCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/categories`, {
        cache: 'no-store'
      })
      const result = await response.json()      
      return result.data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }  

  const categories = await getCategories()
  // const categories = await categoryService.getAll()

  return (
    <AdminTemplate>
      <CategoriesClient initialCategories={categories || []} />
    </AdminTemplate>
  )
}