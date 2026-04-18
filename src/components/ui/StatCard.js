export default function StatCard({ label, value, sub, icon: Icon, accent = 'green' }) {
  const accents = {
    green:  'text-brand-400 bg-brand-500/10',
    blue:   'text-blue-400 bg-blue-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    red:    'text-red-400 bg-red-500/10',
  }
  return (
    <div className="card flex items-start gap-4">
      {Icon && (
        <div className={`p-2.5 rounded-xl ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-100 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
