import { Routes, Route } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">FlowSync</h1>
      </header>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
        <Analytics/>
    </div>
  )
}

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Welcome to FlowSync
        </h2>
        <p className="text-gray-600">
          MCP 기반 노션 연동형 프로젝트 워크플로우 관리 시스템
        </p>
      </div>
    </div>
  )
}

export default App
