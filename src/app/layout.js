import './styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/ui/AuthProvider'

export const metadata = {
  title: 'GolfSwing — Play. Win. Give.',
  description: 'Track your Stableford scores, enter monthly prize draws, and support a charity you care about.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
