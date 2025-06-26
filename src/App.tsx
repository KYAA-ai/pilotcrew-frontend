import { EmployeeAuthGuard } from '@/components/auth/employee-auth-guard'
import { EmployerAuthGuard } from '@/components/auth/employer-auth-guard'
import { GoogleAuthCallback } from '@/components/auth/GoogleAuthCallback'
import { Toaster } from '@/components/ui/sonner'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardPage from './pages/Dashboard'
import EmployeeAuth from './pages/EmployeeAuth'
import EmployeeProfile from './pages/EmployeeProfile'
import EmployerAuth from './pages/EmployerAuth'
import EmployerProfile from './pages/EmployerProfile'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Auth Callback */}
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
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
              <DashboardPage />
            </EmployeeAuthGuard>
          }
        />
        {/* Employer Dashboard with proper auth guard */}
        <Route
          path="/employer/dashboard"
          element={
            <EmployerAuthGuard>
              <DashboardPage />
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
    </ProfileProvider>
  )
}

export default App
