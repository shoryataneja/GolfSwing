'use client'
import { useEffect, useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import { RiUserLine, RiSearchLine } from 'react-icons/ri'

export default function AdminUsersPage() {
  const [data, setData] = useState({ users: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/users?page=${page}&limit=20`)
      .then(r => r.json())
      .then(j => { setData(j.data || { users: [], total: 0 }); setLoading(false) })
  }, [page])

  const filtered = data.users.filter(u =>
    !search || u.email.includes(search) || u.full_name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(data.total / 20)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-gray-400 mt-1">{data.total} total users</p>
      </div>

      <div className="relative">
        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input className="input pl-9" placeholder="Search by name or email…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              {['User', 'Role', 'Subscription', 'Charity', 'Joined'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-16"><Spinner className="mx-auto" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-16 text-gray-500">No users found.</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-sm font-semibold shrink-0">
                      {u.full_name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-100">{u.full_name}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`badge ${u.role === 'admin' ? 'badge-yellow' : 'badge-gray'}`}>{u.role}</span>
                </td>
                <td className="px-5 py-4">
                  {u.subscriptions ? (
                    <span className={`badge ${u.subscriptions.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                      {u.subscriptions.status} · {u.subscriptions.plan}
                    </span>
                  ) : (
                    <span className="badge badge-gray">none</span>
                  )}
                </td>
                <td className="px-5 py-4 text-gray-400 text-xs">{u.charities?.name || '—'}</td>
                <td className="px-5 py-4 text-gray-500 text-xs">
                  {new Date(u.created_at).toLocaleDateString('en-GB')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm">Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary text-sm">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
