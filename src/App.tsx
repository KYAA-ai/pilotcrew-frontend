import { EmployeeAuthGuard } from '@/components/auth/employee-auth-guard'
import { EmployerAuthGuard } from '@/components/auth/employer-auth-guard'
import { GoogleAuthCallback } from '@/components/auth/GoogleAuthCallback'
import { Toaster } from '@/components/ui/sonner'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { LinkedInAuthCallback } from './components/auth/LinkedInAuthCallback'
import EmployeeAgenticDashboard from './pages/EmployeeAgenticDashboard'
import EmployeeAuth from './pages/EmployeeAuth'
import EmployeeDashboardPage from './pages/EmployeeDashboard'
import EmployeeProfile from './pages/EmployeeProfile'
import EmployeeRecommendedJobs from './pages/EmployeeRecommendedJobs'
import EmployerAuth from './pages/EmployerAuth'
import EmployerDashboardPage from './pages/EmployerDashboard'
import EmployerProfile from './pages/EmployerProfile'
import LandingPage from './pages/LandingPage'
import JobFormPage from './pages/JobFormPage';
import JobDetailsPage from './pages/JobDetailsPage';

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
              <EmployeeDashboardPage />
            </EmployeeAuthGuard>
          }
        />
        <Route
          path="/employee/recommended-jobs"
          element={
            <EmployeeAuthGuard>
              <EmployeeRecommendedJobs />
            </EmployeeAuthGuard>
          }
        />
        <Route
          path="/employee/jobs/:jobId"
          element={
            <EmployeeAuthGuard>
              <JobDetailsPage />
            </EmployeeAuthGuard>
          }
        />
        <Route
          path="/employee/agentic-dashboard"
          element={
            <EmployeeAuthGuard>
              <EmployeeAgenticDashboard />
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
              <EmployerDashboardPage />
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
        <Route
          path="/employer/jobs/new"
          element={
            <EmployerAuthGuard>
              <JobFormPage />
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
