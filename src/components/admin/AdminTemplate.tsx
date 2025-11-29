import React from 'react'
import AdminSidebar from "./AdminSidebar";

interface AdminTemplateProps {
  children: React.ReactNode;
}

export default function AdminTemplate({ children }: AdminTemplateProps) {
  return (
     <div className={`min-h-screen bg-zinc-50 font-ubuntu`}>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
