import { EmployeeAuthGuard } from '@/components/auth/employee-auth-guard'
import { EmployerAuthGuard } from '@/components/auth/employer-auth-guard'
import { GoogleAuthCallback } from '@/components/auth/GoogleAuthCallback'
import { Toaster } from '@/components/ui/sonner'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import EmployerDashboardPage from './pages/EmployerDashboard'
import EmployeeAuth from './pages/EmployeeAuth'
import EmployeeProfile from './pages/EmployeeProfile'
import EmployerAuth from './pages/EmployerAuth'
import EmployerProfile from './pages/EmployerProfile'
import LandingPage from './pages/LandingPage'
import { LinkedInAuthCallback } from './components/auth/LinkedInAuthCallback'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Auth Callback */}
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInAuthCallback />} />
        {/* Employer Flow */}
        <Route path="/auth/employer" element={<EmployerAuth />} />
        {/* Employee Flow */}
        <Route path="/auth/employee" element={<EmployeeAuth />} />
        {/* Protected routes */}
        <Route
          path="/employee/profile"
          element={
            <EmployeeAuthGuard>
              <EmployeeProfile />
            </EmployeeAuthGuard>
          }
        />
        <Route
          path="/employee/dashboard"
          element={
            <EmployeeAuthGuard>
              <div>
                <h1>Employee Dashboard</h1>
              </div>
            </EmployeeAuthGuard>
          }
        />
        {/* Employer Dashboard with proper auth guard */}
        <Route
          path="/employer/dashboard"
          element={
            <EmployerAuthGuard>
              <EmployerDashboardPage />
            </EmployerAuthGuard>
          }
        />
        <Route
          path="/employer/example"
          element={
            <EmployerAuthGuard>
              <div>
                <h1>Employer Example</h1>
              </div>
            </EmployerAuthGuard>
          }
        />
        {/* Employer Profile */}
        <Route
          path="/employer/profile"
          element={
            <EmployerAuthGuard>
              <EmployerProfile />
            </EmployerAuthGuard>
          }
        />
        {/* Fallback to landing for unknown routes */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
