import { Routes, Route, Navigate } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

import Dashboard from './pages/Dashboard'
import ApprovalRoadmap from './pages/ApprovalRoadmap'
import CompanyProfile from './pages/CompanyProfile'
import Compliance from './pages/Compliance'
import Documents from './pages/Documents'
import GovernmentDashboard from './pages/GovernmentDashboard'
import Projects from './pages/Projects'
import Schemes from './pages/Schemes'
import AIAssistent from './pages/AIAssistent'


function App() {
  return (
    <Routes>

      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />


      {/* Main Application Pages */}
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/approval-roadmap"
        element={<ApprovalRoadmap />}
      />

      <Route
        path="/company-profile"
        element={<CompanyProfile />}
      />

      <Route
        path="/compliance"
        element={<Compliance />}
      />

      <Route
        path="/documents"
        element={<Documents />}
      />

      <Route
        path="/government-dashboard"
        element={<GovernmentDashboard />}
      />

      <Route
        path="/projects"
        element={<Projects />}
      />

      <Route
        path="/schemes"
        element={<Schemes />}
      />

      <Route
        path="/ai-assistant"
        element={<AIAssistent />}
      />


      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  )
}

export default App