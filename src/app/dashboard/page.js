'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/ui/AuthProvider'
import StatCard from '@/components/ui/StatCard'
import Spinner from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'
import {
  RiTrophyLine, RiBarChartLine, RiHeartLine,
  RiCalendarLine, RiArrowRightLine,
} from 'react-icons/ri'

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState({ sub: null, scores: [], winnings: [], loading: true })

  useEffect(() => {
    Promise.all([
      fetch('/api/subscription/status').then(r => r.json()),
      fetch('/api/scores').then(r => r.json()),
      fetch('/api/winners').then(r => r.json()),
    ]).then(([sub, scores, winnings]) => {
      setData({
        sub: sub.data,
        scores: scores.data || [],
        winnings: winnings.data || [],
        loading: false,
      })
    })
  }, [])

  if (data.loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  const totalWon = data.winnings.reduce((s, w) => s + parseFloat(w.prize_amount || 0), 0)
  const subActive = data.sub?.status === 'active'

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.full_name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-400 mt-1">Here&apos;s your GolfSwing overview.</p>
      </div>

      {/* Subscription banner */}
      {!subActive && (
        <div className="card border-yellow-500/30 bg-yellow-500/5 flex items-center justify-between">
          <div>
            <p className="font-semibold text-yellow-400">Subscription inactive</p>
            <p className="text-sm text-gray-400 mt-0.5">Subscribe to enter monthly draws and track scores.</p>
          </div>
          <Link href="/dashboard" className="btn-primary shrink-0">Subscribe now</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Subscription"
          value={subActive ? 'Active' : 'Inactive'}
          sub={subActive ? `${data.sub.plan} · expires ${new Date(data.sub.expires_at).toLocaleDateString('en-GB')}` : 'Not subscribed'}
          icon={RiCalendarLine}
          accent={subActive ? 'green' : 'red'}
        />
        <StatCard label="Scores logged" value={data.scores.length} sub="Max 5 stored" icon={RiBarChartLine} accent="blue" />
        <StatCard label="Total winnings" value={formatCurrency(totalWon)} sub={`${data.winnings.length} draw wins`} icon={RiTrophyLine} accent="yellow" />
        <StatCard
          label="Charity"
          value={user?.charities?.name || 'Not selected'}
          sub={user?.charity_pct ? `${user.charity_pct}% contribution` : ''}
          icon={RiHeartLine}
          accent="red"
        />
      </div>

      {/* Recent scores */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Recent Scores</h2>
          <Link href="/dashboard/scores" className="btn-ghost text-xs">
            Manage <RiArrowRightLine className="h-3.5 w-3.5" />
          </Link>
        </div>
        {data.scores.length === 0 ? (
          <p className="text-gray-500 text-sm">No scores logged yet. <Link href="/dashboard/scores" className="text-brand-400 hover:underline">Add your first score →</Link></p>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {data.scores.map(s => (
              <div key={s.id} className="flex flex-col items-center p-3 rounded-xl bg-gray-800 min-w-[72px]">
                <span className="text-2xl font-bold text-white">{s.score}</span>
                <span className="text-xs text-gray-500 mt-1">{new Date(s.score_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent winnings */}
      {data.winnings.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-white mb-5">Recent Winnings</h2>
          <div className="space-y-3">
            {data.winnings.slice(0, 3).map(w => (
              <div key={w.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-100">
                    {w.tier === 5 ? '🏆 Jackpot' : w.tier === 4 ? '🥈 Tier 2' : '🥉 Tier 3'} — {w.draws?.draw_month}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Matched: {w.matched_numbers?.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-400">{formatCurrency(w.prize_amount)}</p>
                  <span className={`badge text-xs ${w.payment_status === 'paid' ? 'badge-green' : w.payment_status === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>
                    {w.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
