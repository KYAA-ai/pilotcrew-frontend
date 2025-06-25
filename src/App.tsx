import { AuthGuard } from '@/components/auth-guard'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardPage from './pages/Dashboard'
import EmployeeAuth from './pages/EmployeeAuth'
import EmployeeProfile from './pages/EmployeeProfile'
import EmployerAuth from './pages/EmployerAuth'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Employer Flow */}
      <Route path="/auth/employer" element={<EmployerAuth />} />
      {/* Employee Flow */}
      <Route path="/auth/employee" element={<EmployeeAuth />} />
      {/* Protected routes */}
      <Route
        path="/employee/profile"
        element={
          <AuthGuard>
            <EmployeeProfile />
          </AuthGuard>
        }
      />
      <Route
        path="/employee/dashboard"
        element={
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        }
      />
      {/* Fallback to landing for unknown routes */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default App
