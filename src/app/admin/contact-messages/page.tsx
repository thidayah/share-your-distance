import AdminTemplate from "@/components/admin/AdminTemplate";
import ContactMessagesClient from "@/components/admin/ContactMessagesClient";

export default async function ContactMessages() {
  return (
    <AdminTemplate>
      <ContactMessagesClient />
    </AdminTemplate>
  )
}
