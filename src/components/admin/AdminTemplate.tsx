import React from 'react'
import AdminSidebar from "./AdminSidebar";
import { requireAdminAuth } from "@/lib/admin-session";
import { Bounce, ToastContainer } from "react-toastify";

interface AdminTemplateProps {
  children: React.ReactNode;
}

export default async function AdminTemplate({ children }: AdminTemplateProps) {

  await requireAdminAuth()

  return (
    <div className={`min-h-screen bg-zinc-50 font-ubuntu`}>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        // hideProgressBar={false}
        newestOnTop={true}
        // closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme="dark"
        transition={Bounce}
      />
    </div>
  )
}
