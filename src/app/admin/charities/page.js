'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import { RiAddLine } from 'react-icons/ri'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)

  const fetchCharities = async () => {
    const res = await fetch('/api/admin/charities')
    const json = await res.json()
    setCharities(json.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCharities() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      toast.success('Charity added')
      setModal(false)
      setForm({ name: '', description: '' })
      fetchCharities()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (id, active) => {
    try {
      const res = await fetch('/api/admin/charities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !active }),
      })
      if (!res.ok) throw new Error('Failed to update')
      toast.success(`Charity ${!active ? 'activated' : 'deactivated'}`)
      fetchCharities()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Charities</h1>
          <p className="text-gray-400 mt-1">Manage available charities for users to support.</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary">
          <RiAddLine className="h-4 w-4" />Add Charity
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center pt-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {charities.map(c => (
            <div key={c.id} className={`card ${!c.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{c.name}</h3>
                    <span className={`badge ${c.active ? 'badge-green' : 'badge-gray'}`}>{c.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className="text-sm text-gray-400">{c.description}</p>
                </div>
                <button onClick={() => toggleActive(c.id, c.active)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${c.active ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25' : 'bg-brand-500/15 text-brand-400 hover:bg-brand-500/25'}`}>
                  {c.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add Charity">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" placeholder="Charity name" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} placeholder="Brief description…"
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? <Spinner size="sm" /> : 'Add Charity'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
