'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Spinner from '@/components/ui/Spinner'
import { formatCurrency, getCurrentMonth } from '@/lib/utils'
import { RiPlayLine, RiCheckLine, RiRefreshLine } from 'react-icons/ri'

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [publishing, setPublishing] = useState(null)

  const fetchDraws = async () => {
    const res = await fetch('/api/admin/draws')
    const json = await res.json()
    setDraws(json.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchDraws() }, [])

  const handleRun = async () => {
    setRunning(true)
    try {
      const res = await fetch('/api/draw/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      toast.success(`Draw simulated — numbers: ${json.data.draw.numbers.join(', ')}`)
      fetchDraws()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setRunning(false)
    }
  }

  const handlePublish = async (drawId) => {
    setPublishing(drawId)
    try {
      const res = await fetch('/api/admin/draws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      toast.success('Draw published!')
      fetchDraws()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setPublishing(null)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Draws</h1>
          <p className="text-gray-400 mt-1">Run and publish monthly prize draws.</p>
        </div>
        <button onClick={handleRun} className="btn-primary" disabled={running}>
          {running ? <Spinner size="sm" /> : <><RiPlayLine className="h-4 w-4" />Run Draw ({getCurrentMonth()})</>}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><Spinner size="lg" /></div>
      ) : draws.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400">No draws yet. Run the first draw above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {draws.map(draw => (
            <div key={draw.id} className="card">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-white text-lg">{draw.draw_month}</h3>
                    <span className={`badge ${draw.status === 'published' ? 'badge-green' : 'badge-yellow'}`}>
                      {draw.status}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {draw.numbers.map(n => (
                      <span key={n} className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border-2 border-gray-700 bg-gray-800 text-gray-300">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-gray-500">Prize pool</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(draw.prize_pool)}</p>
                  {draw.jackpot_rollover > 0 && (
                    <p className="text-xs text-yellow-400">Rollover: {formatCurrency(draw.jackpot_rollover)}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between flex-wrap gap-4">
                <div className="grid grid-cols-3 gap-6 text-center">
                  {[['Jackpot (5)', draw.jackpot_amount], ['Tier 2 (4)', draw.tier2_amount], ['Tier 3 (3)', draw.tier3_amount]].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-xs text-gray-500">{l}</p>
                      <p className="text-sm font-semibold text-gray-200">{formatCurrency(v)}</p>
                    </div>
                  ))}
                </div>
                {draw.status === 'simulated' && (
                  <div className="flex gap-3">
                    <button onClick={handleRun} className="btn-secondary text-sm" disabled={running}>
                      <RiRefreshLine className="h-4 w-4" />Re-run
                    </button>
                    <button onClick={() => handlePublish(draw.id)} className="btn-primary text-sm" disabled={publishing === draw.id}>
                      {publishing === draw.id ? <Spinner size="sm" /> : <><RiCheckLine className="h-4 w-4" />Publish</>}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
