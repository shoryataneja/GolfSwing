import Link from 'next/link'
import { RiTrophyLine, RiHeartLine, RiBarChartLine, RiArrowRightLine, RiCheckLine } from 'react-icons/ri'

const features = [
  { icon: RiBarChartLine, title: 'Track Your Game', desc: 'Log your last 5 Stableford scores. Your performance is your lottery ticket.' },
  { icon: RiTrophyLine,   title: 'Monthly Prize Draws', desc: 'Match your scores to the draw numbers. 3, 4, or 5 matches wins you a share of the prize pool.' },
  { icon: RiHeartLine,    title: 'Give Back', desc: 'A portion of every subscription goes directly to a charity you choose.' },
]

const plans = [
  {
    name: 'Monthly',
    price: '₹299',
    period: '/month',
    features: ['Score tracking', 'Monthly draw entry', 'Charity contribution', 'Win history'],
    cta: 'Start Monthly',
    highlight: false,
  },
  {
    name: 'Yearly',
    price: '₹2,999',
    period: '/year',
    features: ['Everything in Monthly', '2 months free', 'Priority support', 'Early draw results'],
    cta: 'Start Yearly',
    highlight: true,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800/50 sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-white">Golf<span className="text-brand-400">Swing</span></span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost">Sign in</Link>
            <Link href="/signup" className="btn-primary">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
          Monthly draw now open
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
          Your scores could<br />
          <span className="text-brand-400">win you thousands.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Track your Stableford scores, enter monthly prize draws, and support a charity you care about — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">
          Start for ₹299/mo <RiArrowRightLine className="h-5 w-5" />
          </Link>
          <Link href="/login" className="btn-secondary text-base px-8 py-3">
            Sign in
          </Link>
        </div>
        {/* Prize pool teaser */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[['₹2,40,000+', 'Current prize pool'], ['847', 'Active members'], ['₹18,20,000', 'Donated to charity']].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <p className="text-2xl font-bold text-white">{val}</p>
              <p className="text-xs text-gray-500 mt-1">{lbl}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-gray-700 transition-colors">
              <div className="p-2.5 rounded-xl bg-brand-500/10 w-fit mb-4">
                <Icon className="h-6 w-6 text-brand-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple pricing</h2>
        <p className="text-gray-400 text-center mb-12">No hidden fees. Cancel anytime.</p>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`card relative ${plan.highlight ? 'border-brand-500/50 ring-1 ring-brand-500/30' : ''}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-semibold">Best value</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-3 mb-6">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <RiCheckLine className="h-4 w-4 text-brand-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={plan.highlight ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} GolfSwing. All rights reserved.</p>
      </footer>
    </div>
  )
}
