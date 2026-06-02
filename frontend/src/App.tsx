import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import { Home as HomeIcon, LayoutDashboard, Settings as SettingsIcon, FolderKanban } from 'lucide-react'
import { clsx } from 'clsx'
import { Dashboard, TaskBoard, ProjectManagement, Settings, SyncLogs } from './pages'

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
              <NavLink to="/" icon={HomeIcon} label="홈" active={location.pathname === '/'} />
              <NavLink to="/board" icon={LayoutDashboard} label="보드" active={location.pathname.startsWith('/board')} />
              <NavLink to="/projects" icon={FolderKanban} label="프로젝트" active={location.pathname === '/projects'} />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className={clsx(
                "p-2 rounded-lg transition-colors",
                location.pathname === '/settings'
                  ? "text-gray-900 bg-gray-100 dark:text-gray-100 dark:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
              )}
            >
              <SettingsIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board" element={<TaskBoard />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sync-logs" element={<SyncLogs />} />
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

export default App
