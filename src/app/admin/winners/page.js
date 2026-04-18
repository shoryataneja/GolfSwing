'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Spinner from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'

const TIER_LABELS = { 5: '🏆 Jackpot', 4: '🥈 Tier 2', 3: '🥉 Tier 3' }

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const fetchWinners = async () => {
    const res = await fetch('/api/admin/winners')
    const json = await res.json()
    setWinners(json.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchWinners() }, [])

  const update = async (winnerId, updates) => {
    setUpdating(winnerId)
    try {
      const res = await fetch('/api/admin/winners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId, ...updates }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      toast.success('Updated')
      fetchWinners()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Winners</h1>
        <p className="text-gray-400 mt-1">Verify winners and manage payouts.</p>
      </div>

      {winners.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400">No winners yet.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Winner', 'Draw', 'Tier', 'Prize', 'Verification', 'Payment', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {winners.map(w => (
                <tr key={w.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-100">{w.users?.full_name}</p>
                    <p className="text-gray-500 text-xs">{w.users?.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{w.draws?.draw_month}</td>
                  <td className="px-5 py-4 text-gray-300">{TIER_LABELS[w.tier]}</td>
                  <td className="px-5 py-4 font-semibold text-brand-400">{formatCurrency(w.prize_amount)}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${w.verification === 'approved' ? 'badge-green' : w.verification === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>
                      {w.verification}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${w.payment_status === 'paid' ? 'badge-green' : w.payment_status === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>
                      {w.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {w.verification === 'pending' && (
                        <>
                          <button onClick={() => update(w.id, { verification: 'approved' })}
                            disabled={updating === w.id}
                            className="px-2.5 py-1 rounded-lg bg-brand-500/15 text-brand-400 text-xs font-medium hover:bg-brand-500/25 transition-colors">
                            Approve
                          </button>
                          <button onClick={() => update(w.id, { verification: 'rejected' })}
                            disabled={updating === w.id}
                            className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                      {w.verification === 'approved' && w.payment_status === 'pending' && (
                        <button onClick={() => update(w.id, { paymentStatus: 'paid' })}
                          disabled={updating === w.id}
                          className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition-colors">
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
