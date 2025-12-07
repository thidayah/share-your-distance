import AdminTemplate from "@/components/admin/AdminTemplate"
import RegistrationsClient from '@/components/admin/RegistrationsClient'

export default async function RegistrationsPage() {
  return (
    <AdminTemplate>
      <RegistrationsClient />
    </AdminTemplate>
  )
}