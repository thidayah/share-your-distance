// import { createClient } from '@/lib/supabase/server-client'

import AdminTemplate from "@/components/admin/AdminTemplate"

export default async function RegistrationPage() {
  // const supabase = createClient()

  // Example: Fetch users data (adjust based on your actual tables)
  const users: any = []
  const error = null
  // const { data: users, error } = null
  // const { data: users, error } = await supabase
  //   .from('profiles') // Ganti dengan tabel users/profiles Anda
  //   .select('*')
  //   .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  return (
    <AdminTemplate>
      <div className="space-y-6">
        {/* <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-zinc-900">User Registrations</h1>
          <div className="text-sm text-zinc-600">
            Manage user accounts and registrations
          </div>
        </div> */}

        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
          <div className="p-6 border-b border-zinc-200">
            <h2 className="text-xl font-semibold text-zinc-900">All Participats</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200">
                {users && users.length > 0 ? (
                  users.map((user: any) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-900">
                          {user.email || user.username || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-zinc-600 hover:text-zinc-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-zinc-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminTemplate>
  )
}