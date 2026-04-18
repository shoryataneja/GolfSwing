'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/ui/AuthProvider'
import Spinner from '@/components/ui/Spinner'
import { RiCheckLine } from 'react-icons/ri'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [charities, setCharities] = useState([])
  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    charityId: '', charityPct: 10, plan: 'monthly',
  })
  const [loading, setLoading] = useState(false)
  const { refetch } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/charity').then(r => r.json()).then(j => setCharities(j.data || []))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          charityId: form.charityId || null,
          charityPct: form.charityPct,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      // Subscribe
      await fetch('/api/subscription/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: form.plan }),
      })

      await refetch()
      toast.success('Account created! Welcome to GolfSwing.')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="card">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step >= s ? 'bg-brand-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                {step > s ? <RiCheckLine className="h-4 w-4" /> : s}
              </div>
              {s < 2 && <div className={`h-px w-8 transition-colors ${step > s ? 'bg-brand-500' : 'bg-gray-700'}`} />}
            </div>
          ))}
          <span className="ml-2 text-sm text-gray-400">{step === 1 ? 'Your details' : 'Choose a charity'}</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
        <p className="text-gray-400 text-sm mb-8">Join GolfSwing today</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label className="label">Full name</label>
                <input className="input" placeholder="Alex Johnson" value={form.fullName}
                  onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Min. 8 characters" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} minLength={8} required />
              </div>
              <div>
                <label className="label">Plan</label>
                <div className="grid grid-cols-2 gap-3">
                  {[['₹299/mo', 'monthly'], ['₹2,999/yr', 'yearly']].map(([label, val]) => (
                    <button key={val} type="button"
                      onClick={() => setForm(p => ({ ...p, plan: val }))}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${form.plan === val ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                      {label}
                      {val === 'yearly' && <span className="block text-xs text-brand-400 mt-0.5">Save 17%</span>}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">Continue</button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-gray-400">Select a charity to receive at least 10% of your subscription.</p>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {charities.map(c => (
                  <button key={c.id} type="button"
                    onClick={() => setForm(p => ({ ...p, charityId: c.id }))}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${form.charityId === c.id ? 'border-brand-500 bg-brand-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                    <p className="font-medium text-gray-100">{c.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{c.description}</p>
                  </button>
                ))}
              </div>
              <div>
                <label className="label">Contribution % (min 10%)</label>
                <input type="number" className="input" min={10} max={100} value={form.charityPct}
                  onChange={e => setForm(p => ({ ...p, charityPct: parseInt(e.target.value) || 10 }))} required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Create account'}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
