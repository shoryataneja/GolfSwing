'use client'
import { useEffect, useState } from 'react'
import StatCard from '@/components/ui/StatCard'
import Spinner from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'
import { RiUserLine, RiTrophyLine, RiHeartLine, RiCurrencyLine } from 'react-icons/ri'

export default function AdminPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/admin/analytics').then(r => r.json()).then(j => setData(j.data))
  }, [])

  if (!data) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Platform overview and key metrics.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users"          value={data.totalUsers}          icon={RiUserLine}                accent="blue" />
        <StatCard label="Active Subscriptions" value={data.activeSubscriptions} icon={RiCurrencyLine}   accent="green" />
        <StatCard label="Total Prize Pool"     value={formatCurrency(data.totalPrizePool)} icon={RiTrophyLine}  accent="yellow" />
        <StatCard label="Total Donated"        value={formatCurrency(data.totalDonations)} icon={RiHeartLine}   accent="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent draws */}
        <div className="card">
          <h2 className="font-semibold text-white mb-5">Recent Draws</h2>
          {data.recentDraws.length === 0 ? (
            <p className="text-gray-500 text-sm">No draws yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentDraws.map(d => (
                <div key={d.draw_month} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-sm text-gray-300">{d.draw_month}</span>
                  <span className="text-sm font-semibold text-white">{formatCurrency(d.prize_pool)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Donations by charity */}
        <div className="card">
          <h2 className="font-semibold text-white mb-5">Donations by Charity</h2>
          {data.donationsByCharity.length === 0 ? (
            <p className="text-gray-500 text-sm">No donations yet.</p>
          ) : (
            <div className="space-y-3">
              {data.donationsByCharity.map(d => (
                <div key={d.charity_id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-sm text-gray-300">{d.name}</span>
                  <span className="text-sm font-semibold text-brand-400">{formatCurrency(d.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
