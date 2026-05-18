import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import { Home as HomeIcon, LayoutDashboard, Settings } from 'lucide-react'
import { clsx } from 'clsx'
import { TaskBoard } from './pages'

function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                FlowSync
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <NavLink to="/" icon={HomeIcon} label="Home" active={location.pathname === '/'} />
              <NavLink to="/board" icon={LayoutDashboard} label="Board" active={location.pathname.startsWith('/board')} />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board" element={<TaskBoard />} />
        </Routes>
      </main>

      <Analytics />
    </div>
  )
}

interface NavLinkProps {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
}

function NavLink({ to, icon: Icon, label, active }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
        active
          ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">FS</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome to FlowSync
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              MCP-based Notion integrated workflow management
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <FeatureCard
            title="Kanban Board"
            description="Drag and drop tasks between workflow statuses"
            icon="layout"
          />
          <FeatureCard
            title="Calendar View"
            description="Visualize tasks by due date on a calendar"
            icon="calendar"
          />
          <FeatureCard
            title="List View"
            description="Table view with sorting and filtering"
            icon="list"
          />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/board"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Go to Task Board
          </Link>
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: 'layout' | 'calendar' | 'list'
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const iconColors = {
    layout: 'from-blue-500 to-blue-600',
    calendar: 'from-green-500 to-green-600',
    list: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
      <div className={clsx(
        'w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br',
        iconColors[icon]
      )}>
        {icon === 'layout' && <LayoutDashboard className="w-5 h-5 text-white" />}
        {icon === 'calendar' && (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        {icon === 'list' && (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}

export default App
