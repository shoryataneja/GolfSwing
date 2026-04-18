'use client'
import { useEffect, useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import { formatCurrency } from '@/lib/utils'
import { RiTrophyLine } from 'react-icons/ri'

const TIER_LABELS = { 5: '🏆 Jackpot', 4: '🥈 Tier 2', 3: '🥉 Tier 3' }

export default function DrawsPage() {
  const [draws, setDraws] = useState([])
  const [winnings, setWinnings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/draw/result').then(r => r.json()),
      fetch('/api/winners').then(r => r.json()),
    ]).then(([d, w]) => {
      setDraws(d.data || [])
      setWinnings(w.data || [])
      setLoading(false)
    })
  }, [])

  const winMap = Object.fromEntries(winnings.map(w => [w.draw_id, w]))

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Draw Results</h1>
        <p className="text-gray-400 mt-1">Published monthly draws and your participation history.</p>
      </div>

      {draws.length === 0 ? (
        <div className="card text-center py-16">
          <RiTrophyLine className="h-12 w-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400">No draws published yet. Check back after the monthly draw.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {draws.map(draw => {
            const win = winMap[draw.id]
            return (
              <div key={draw.id} className={`card ${win ? 'border-brand-500/40 bg-brand-500/5' : ''}`}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-white text-lg">{draw.draw_month}</h3>
                      <span className="badge badge-green">Published</span>
                      {win && <span className="badge badge-yellow">{TIER_LABELS[win.tier]}</span>}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {draw.numbers.map(n => (
                        <span key={n}
                          className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                            ${win?.matched_numbers?.includes(n)
                              ? 'border-brand-500 bg-brand-500/20 text-brand-400'
                              : 'border-gray-700 bg-gray-800 text-gray-300'}`}>
                          {n}
                        </span>
                      ))}
                    </div>
                    {win && (
                      <p className="text-sm text-gray-400 mt-3">
                        You matched: <span className="text-brand-400 font-medium">{win.matched_numbers.join(', ')}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Prize pool</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(draw.prize_pool)}</p>
                    {win && (
                      <p className="text-brand-400 font-semibold mt-1">
                        You won {formatCurrency(win.prize_amount)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tier breakdown */}
                <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: 'Jackpot (5)', amount: draw.jackpot_amount },
                    { label: 'Tier 2 (4)', amount: draw.tier2_amount },
                    { label: 'Tier 3 (3)', amount: draw.tier3_amount },
                  ].map(t => (
                    <div key={t.label}>
                      <p className="text-xs text-gray-500">{t.label}</p>
                      <p className="text-sm font-semibold text-gray-200 mt-0.5">{formatCurrency(t.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
