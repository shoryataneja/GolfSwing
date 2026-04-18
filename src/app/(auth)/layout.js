import Link from 'next/link'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <nav className="border-b border-gray-800/50 px-4 h-16 flex items-center">
        <Link href="/" className="text-xl font-bold text-white">
          Golf<span className="text-brand-400">Swing</span>
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}
