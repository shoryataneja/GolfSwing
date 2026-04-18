'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/ui/AuthProvider'
import Spinner from '@/components/ui/Spinner'
import {
  RiDashboardLine, RiBarChartLine, RiTrophyLine,
  RiHeartLine, RiLogoutBoxLine, RiShieldLine,
} from 'react-icons/ri'

const navItems = [
  { href: '/dashboard',          label: 'Overview',     icon: RiDashboardLine },
  { href: '/dashboard/scores',   label: 'My Scores',    icon: RiBarChartLine },
  { href: '/dashboard/draws',    label: 'Draw Results', icon: RiTrophyLine },
  { href: '/dashboard/charity',  label: 'My Charity',   icon: RiHeartLine },
]

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-gray-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link href="/" className="text-xl font-bold text-white">
            Golf<span className="text-brand-400">Swing</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-brand-500/15 text-brand-400' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`}>
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {label}
              </Link>
            )
          })}
          {user?.role === 'admin' && (
            <Link href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-yellow-400 hover:bg-yellow-500/10 transition-all mt-4">
              <RiShieldLine className="h-4.5 w-4.5 shrink-0" />
              Admin Panel
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-sm font-semibold">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-100 truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="btn-ghost w-full justify-start text-gray-400">
            <RiLogoutBoxLine className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
