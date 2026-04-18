'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/ui/AuthProvider'
import Spinner from '@/components/ui/Spinner'
import {
  RiDashboardLine, RiUserLine, RiTrophyLine,
  RiHeartLine, RiBarChartLine, RiLogoutBoxLine, RiShieldLine,
} from 'react-icons/ri'

const navItems = [
  { href: '/admin',           label: 'Analytics',  icon: RiBarChartLine },
  { href: '/admin/draws',     label: 'Draws',      icon: RiTrophyLine },
  { href: '/admin/users',     label: 'Users',      icon: RiUserLine },
  { href: '/admin/winners',   label: 'Winners',    icon: RiDashboardLine },
  { href: '/admin/charities', label: 'Charities',  icon: RiHeartLine },
]

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth()
  const pathname = usePathname()

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><Spinner size="lg" /></div>

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-60 shrink-0 border-r border-gray-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 gap-2">
          <RiShieldLine className="h-5 w-5 text-yellow-400" />
          <span className="text-lg font-bold text-white">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-yellow-500/15 text-yellow-400' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`}>
                <Icon className="h-4 w-4 shrink-0" />{label}
              </Link>
            )
          })}
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-all mt-4">
            <RiDashboardLine className="h-4 w-4 shrink-0" />User Dashboard
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-sm font-semibold">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-100 truncate">{user?.full_name}</p>
              <span className="badge badge-yellow text-xs">Admin</span>
            </div>
          </div>
          <button onClick={logout} className="btn-ghost w-full justify-start text-gray-400">
            <RiLogoutBoxLine className="h-4 w-4" />Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}
