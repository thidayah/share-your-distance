'use client'
import { useEffect, useState } from 'react'
import { getCurrentAdmin } from "@/lib/admin-session";
import RegistrationStatsV2 from "./RegistrationStatsV2";

const DashboardClientV2 = () => {
  const [user, setUser] = useState<{ name: string }|null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    failed: 0,
    refunded: 0,
    cancelled: 0
  })

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentAdmin()
        setUser(data)
        fetchStats()
      } catch (error) {
        console.error("Error auth check:", error);
      }
    })();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/registrations-v2/stats')
      if (response.ok) {
        const result = await response.json()
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <div className="text-sm text-zinc-600">
          Welcome, <span className=" font-semibold">{user?.name}</span>
        </div>
      </div>

      <RegistrationStatsV2 stats={stats} />

      {/* Stat Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-zinc-600">Total Users</p>
              <p className="text-2xl font-bold text-zinc-900">{0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-zinc-600">Active Today</p>
              <p className="text-2xl font-bold text-zinc-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-zinc-600">Registrations</p>
              <p className="text-2xl font-bold text-zinc-900">0</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
        <div className="p-4 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <p className="text-zinc-600 text-center py-8">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardClientV2