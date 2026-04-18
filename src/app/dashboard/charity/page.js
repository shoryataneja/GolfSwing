'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/ui/AuthProvider'
import Spinner from '@/components/ui/Spinner'
import { RiHeartLine, RiCheckLine } from 'react-icons/ri'
import { formatCurrency } from '@/lib/utils'

export default function CharityPage() {
  const { user, refetch } = useAuth()
  const [charities, setCharities] = useState([])
  const [donations, setDonations] = useState([])
  const [selected, setSelected] = useState('')
  const [pct, setPct] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/charity').then(r => r.json()),
      fetch('/api/subscription/status').then(r => r.json()),
    ]).then(([c]) => {
      setCharities(c.data || [])
      setSelected(user?.charity_id || '')
      setPct(user?.charity_pct || 10)
      setLoading(false)
    })
  }, [user])

  const handleSave = async () => {
    if (!selected) { toast.error('Please select a charity'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/charity/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId: selected, charityPct: pct }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await refetch()
      toast.success('Charity updated')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  const totalDonated = donations.reduce((s, d) => s + parseFloat(d.amount || 0), 0)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">My Charity</h1>
        <p className="text-gray-400 mt-1">A portion of your subscription goes directly to your chosen charity.</p>
      </div>

      {totalDonated > 0 && (
        <div className="card border-brand-500/30 bg-brand-500/5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-500/15">
            <RiHeartLine className="h-6 w-6 text-brand-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total donated through GolfSwing</p>
            <p className="text-2xl font-bold text-brand-400">{formatCurrency(totalDonated)}</p>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold text-white mb-5">Choose a Charity</h2>
        <div className="space-y-3 mb-6">
          {charities.map(c => (
            <button key={c.id} type="button" onClick={() => setSelected(c.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${selected === c.id ? 'border-brand-500 bg-brand-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
              <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected === c.id ? 'border-brand-500 bg-brand-500' : 'border-gray-600'}`}>
                {selected === c.id && <RiCheckLine className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className="font-medium text-gray-100">{c.name}</p>
                <p className="text-sm text-gray-500 mt-0.5">{c.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="label">Contribution percentage (min 10%)</label>
          <div className="flex items-center gap-4">
            <input type="range" min={10} max={100} step={5} value={pct}
              onChange={e => setPct(parseInt(e.target.value))}
              className="flex-1 accent-brand-500" />
            <span className="text-lg font-bold text-brand-400 w-14 text-right">{pct}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            At ₹299/mo, that&apos;s <span className="text-gray-300">{formatCurrency((299 * pct) / 100)}</span> per month to your charity.
          </p>
        </div>

        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? <Spinner size="sm" /> : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
