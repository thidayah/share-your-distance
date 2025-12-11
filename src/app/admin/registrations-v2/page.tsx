import AdminTemplate from "@/components/admin/AdminTemplate"
import RegistrationsClientV2 from "@/components/admin/RegistrationsClientV2"

export default async function RegistrationsPageV2() {
  return (
    <AdminTemplate>
      <RegistrationsClientV2 />
    </AdminTemplate>
  )
}