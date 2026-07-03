import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Landing() {
  const { colorTheme } = useTheme()

  const themeColors = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    indigo: 'text-indigo-400',
    purple: 'text-purple-400',
    rose: 'text-rose-400',
    amber: 'text-amber-400'
  }

  const primaryText = themeColors[colorTheme] || themeColors.purple

  return (
    <div className="min-h-screen bg-bg-main text-main font-sans selection:bg-primary-light">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-bg-main/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <span className="text-xl font-black text-primary">₹</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-main">Budget Buddy</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-semibold text-secondary hover:text-main transition-colors">
                Sign in
              </Link>
              <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Abstract Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider text-secondary uppercase">Your Financial Companion</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            Master your money. <br className="hidden sm:block" />
            <span className={primaryText}>Without the spreadsheets.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-secondary mb-10 leading-relaxed">
            Budget Buddy is a premium, privacy-first personal finance dashboard designed to help you track spending, build savings goals, and understand your financial velocity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
              Start Building Wealth
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-surface border border-white/10 hover:border-white/20 text-main font-bold text-lg transition-all hover:bg-white/5">
              Explore Features
            </a>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div id="features" className="py-24 bg-surface border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-secondary text-lg">Designed for clarity, built for speed.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Semantic Categorization"
              description="Instantly recognize income, expenses, and balances with our psychology-backed color-coded interface."
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              }
            />
            <FeatureCard 
              title="Smart Budget Alerts"
              description="Set limits and receive elegant visual warnings when you're approaching your spending thresholds."
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              }
            />
            <FeatureCard 
              title="Privacy First"
              description="Your data stays encrypted. No invasive bank syncing required. You remain in absolute control."
              icon={
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              }
            />
          </div>
        </div>
      </div>

      {/* Social Proof / Stats */}
      <div className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by people who care about their wealth</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-extrabold text-primary mb-2">99%</p>
              <p className="text-sm text-secondary font-medium">Uptime Guarantee</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary mb-2">256-bit</p>
              <p className="text-sm text-secondary font-medium">Bank-grade Encryption</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary mb-2">0</p>
              <p className="text-sm text-secondary font-medium">Hidden Fees</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-primary mb-2">24/7</p>
              <p className="text-sm text-secondary font-medium">Financial Clarity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-primary/20 rounded-md flex items-center justify-center border border-primary/30">
              <span className="text-xs font-black text-primary">₹</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-main">Budget Buddy</span>
          </div>
          <div className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Budget Buddy Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-bg-main p-8 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors group">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-secondary leading-relaxed">{description}</p>
    </div>
  )
}
