import { EmployeeAuthGuard } from '@/components/auth/employee-auth-guard'
import { EmployerAuthGuard } from '@/components/auth/employer-auth-guard'
import { AutoEvalAuthGuard } from '@/components/auth/autoeval-auth-guard'
import { GoogleAuthCallback } from '@/components/auth/GoogleAuthCallback'
import { GoogleAutoEvalAuthCallback, GoogleAutoEvalLoginCallback } from '@/components/auth/GoogleAutoEvalAuthCallback'
import { GoogleEmployeeAuthCallback } from '@/components/auth/GoogleEmployeeAuthCallback'
import { GoogleEmployeeLoginCallback } from '@/components/auth/GoogleEmployeeLoginCallback'
import { Toaster } from '@/components/ui/sonner'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { LinkedInAuthCallback } from './components/auth/LinkedInAuthCallback'
import AutoEvalAuth from './components/auth/AutoEvalAuth'
import AutoEvalPage from './pages/AutoEvalPage'
import EmployeeAgenticDashboard from './pages/EmployeeAgenticDashboard'
import EmployeeAuth from './pages/EmployeeAuth'
import EmployeeCompletedJobs from './pages/EmployeeCompletedJobs'
import EmployeeDashboardPage from './pages/EmployeeDashboard'
import EmployeeInProgressJobs from './pages/EmployeeInProgressJobs'
import EmployeeJobWorkflowChatScreen from './pages/EmployeeJobWorkflowChatScreen'
import EmployeeProfile from './pages/EmployeeProfile'
import EmployeeRecommendedJobs from './pages/EmployeeRecommendedJobs'
import EmployerAuth from './pages/EmployerAuth'
import EmployerDashboardPage from './pages/EmployerDashboard'
import EmployerJobDetailsPage from './pages/EmployerJobDetailsPage'
import EmployerProfile from './pages/EmployerProfile'
import JobDetailsPage from './pages/JobDetailsPage'
import JobFormPage from './pages/JobFormPage'
import JobResponsesPage from './pages/JobResponsesPage'
import LandingPage from './pages/LandingPage'
import NewLandingPage from './pages/newLandingPage'

function App() {
  return (
    <>
      <Routes>
        {/* Auth Callback */}
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path="/auth/google-employee/callback" element={<GoogleEmployeeAuthCallback />} />
        <Route path="/auth/google-employee/login/callback" element={<GoogleEmployeeLoginCallback />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInAuthCallback />} />
        {/* AutoEval Google Callbacks */}
        <Route path="/auth/google-autoeval/callback" element={<GoogleAutoEvalAuthCallback />} />
        <Route path="/auth/google-autoeval/login/callback" element={<GoogleAutoEvalLoginCallback />} />
        {/* Employer Flow */}
        <Route path="/auth/employer" element={<EmployerAuth />} />
        {/* Employee Flow */}
        <Route path="/auth/employee" element={<EmployeeAuth />} />
        {/* AutoEval Flow */}
        <Route path="/auth/autoeval" element={<AutoEvalAuth />} />
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
            path="/employee/in-progress-jobs"
            element={
              <EmployeeAuthGuard>
                <EmployeeInProgressJobs />
              </EmployeeAuthGuard>
            }
          />
          <Route
            path="/employee/completed-jobs"
            element={
              <EmployeeAuthGuard>
                <EmployeeCompletedJobs />
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
        <Route
          path="/employee/workflow"
          element={
            <EmployeeAuthGuard>
              <EmployeeJobWorkflowChatScreen />
            </EmployeeAuthGuard>
          }
        />
        {/* Employer Dashboard with proper auth guard */}
        <Route
          path="/employer/jobs"
          element={
            <EmployerAuthGuard>
              <EmployerDashboardPage />
            </EmployerAuthGuard>
          }
        />
        <Route
          path="/employer/jobs/:jobId"
          element={
            <EmployerAuthGuard>
              <EmployerJobDetailsPage />
            </EmployerAuthGuard>
          }
        />
        <Route
          path="/employer/jobs/:jobId/responses"
          element={
            <EmployerAuthGuard>
              <JobResponsesPage />
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
        {/* AutoEval Platform */}
        <Route path="/autoeval" element={<AutoEvalAuth />} />
        <Route
          path="/autoeval/dashboard"
          element={
            <AutoEvalAuthGuard>
              <AutoEvalPage />
            </AutoEvalAuthGuard>
          }
        />
        {/* Fallback to landing for unknown routes */}
        <Route path="/platform" element={<LandingPage />} />
        <Route path="/" element={<NewLandingPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
