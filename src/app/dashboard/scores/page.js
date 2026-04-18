'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Spinner from '@/components/ui/Spinner'
import { RiAddLine, RiDeleteBinLine, RiInformationLine } from 'react-icons/ri'

export default function ScoresPage() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ score: '', scoreDate: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchScores = async () => {
    const res = await fetch('/api/scores')
    const json = await res.json()
    setScores(json.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchScores() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: parseInt(form.score), scoreDate: form.scoreDate }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      toast.success('Score added')
      setForm({ score: '', scoreDate: '' })
      fetchScores()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/scores?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Score removed')
      setScores(s => s.filter(x => x.id !== id))
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">My Scores</h1>
        <p className="text-gray-400 mt-1">Your last 5 Stableford scores. These are matched against monthly draw numbers.</p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
        <RiInformationLine className="h-5 w-5 shrink-0 mt-0.5" />
        <p>Scores must be between 1–45. Only your 5 most recent scores are kept. Adding a 6th automatically removes the oldest.</p>
      </div>

      <div className="card">
        <h2 className="font-semibold text-white mb-5">Add Score</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="label">Stableford Score (1–45)</label>
            <input type="number" min={1} max={45} className="input" placeholder="e.g. 36"
              value={form.score} onChange={e => setForm(p => ({ ...p, score: e.target.value }))} required />
          </div>
          <div className="flex-1">
            <label className="label">Date Played</label>
            <input type="date" className="input" max={new Date().toISOString().split('T')[0]}
              value={form.scoreDate} onChange={e => setForm(p => ({ ...p, scoreDate: e.target.value }))} required />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? <Spinner size="sm" /> : <><RiAddLine className="h-4 w-4" />Add</>}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Stored Scores</h2>
          <span className="text-sm text-gray-500">{scores.length}/5 used</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : scores.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No scores yet. Add your first score above.</p>
        ) : (
          <div className="space-y-3">
            {scores.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-800 group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
                    <span className="text-lg font-bold text-brand-400">{s.score}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-100">
                      {new Date(s.score_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {i === 0 && <span className="badge badge-green text-xs mt-1">Most recent</span>}
                  </div>
                </div>
                <button onClick={() => handleDelete(s.id)}
                  className="btn-ghost text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                  <RiDeleteBinLine className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
