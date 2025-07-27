# Pilotcrew - Employment Platform

A full-stack employment platform built with React + TypeScript + Vite frontend and Express.js + MongoDB backend, supporting both employers and employees with separate authentication flows and role-based access control.

## 🏗️ Project Architecture

This is a dual-role platform where users can be either **Employers** or **Employees**, each with their own authentication flow, dashboard, and protected routes.

### Frontend Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   ├── employee-auth-guard.tsx    # Employee route protection
│   │   ├── employer-auth-guard.tsx    # Employer route protection
│   │   ├── EmployeeLogin.tsx          # Employee login form
│   │   ├── EmployeeSignup.tsx         # Employee registration
│   │   ├── EmployerLogin.tsx          # Employer login form
│   │   └── EmployerSignup.tsx         # Employer registration
│   ├── layout/         # Layout components
│   └── ui/            # Reusable UI components
├── contexts/
│   └── ProfileContext.tsx    # Global profile state management
├── pages/             # Main page components
└── lib/
    └── api.ts         # API client configuration
```

### Backend Structure
```
src/
├── controllers/       # API controllers
│   ├── auth.controller.ts
│   ├── employee/      # Employee-specific endpoints
│   └── employer/      # Employer-specific endpoints
├── models/           # Database models
│   ├── Employee.ts
│   ├── Employer.ts
│   └── Job.ts
├── middleware/       # Authentication middleware
└── routes/          # API routes
```

## 🔐 Authentication System

### User Types & Flow

The platform supports two distinct user types:

1. **Employers** - Companies hiring employees
2. **Employees** - Job seekers

Each user type has:
- Separate authentication endpoints
- Different profile schemas
- Role-specific dashboards
- Protected routes with appropriate guards

### Authentication Guards

#### How They Work

The authentication system uses **Route Guards** to protect pages based on user type and authentication status:

```typescript
// Example: Protecting employer routes
<Route
  path="/employer/jobs"
  element={
    <EmployerAuthGuard>
      <EmployerDashboardPage />
    </EmployerAuthGuard>
  }
/>
```

#### EmployerAuthGuard
- **Purpose**: Protects employer-specific routes
- **Behavior**:
  - Validates JWT token with `/employer/profile` endpoint
  - Redirects to landing page if not authenticated
  - Shows loading spinner during validation
  - Handles token expiration and invalid sessions
  - **User Type Enforcement**: If an employee tries to access employer routes, it clears their profile and switches user type

#### EmployeeAuthGuard
- **Purpose**: Protects employee-specific routes  
- **Behavior**:
  - Validates JWT token with `/employee/profile` endpoint
  - Redirects to `/auth/employee` if not authenticated
  - Shows loading spinner during validation
  - Handles token expiration and invalid sessions
  - **User Type Enforcement**: If an employer tries to access employee routes, it clears their profile and switches user type

### Profile Context

The `ProfileContext` manages global authentication state:

```typescript
interface ProfileContextType {
  profile: Profile | null;           // Current user profile
  userType: 'employer' | 'employee' | null;  // Current user type
  setProfile: (profile: Profile | null) => void;
  isEmployer: () => boolean;         // Type checking helpers
  isEmployee: () => boolean;
  clearProfile: () => void;          // Logout function
  isLoggingOut: boolean;             // Logout state
}
```

**Key Features**:
- Persists profile data in localStorage
- Automatically detects user type from profile data
- Provides type-safe profile access
- Handles logout state management

### Authentication Flow

1. **Landing Page** → User chooses role (Employer/Employee)
2. **Auth Page** → User logs in or signs up
3. **Profile Creation** → Backend creates user profile
4. **Token Storage** → JWT stored in localStorage
5. **Route Protection** → Guards validate access on each route
6. **Dashboard Access** → User redirected to role-specific dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.x
- npm or yarn
- Backend server running (see backend README)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 📱 Available Routes

### Public Routes
- `/` - Landing page with role selection
- `/auth/employer` - Employer authentication
- `/auth/employee` - Employee authentication
- `/auth/google/callback` - Google OAuth callback
- `/auth/linkedin/callback` - LinkedIn OAuth callback

### Protected Employer Routes
- `/employer/jobs` - Employer dashboard
- `/employer/profile` - Employer profile management

### Protected Employee Routes
- `/employee/dashboard` - Employee dashboard
- `/employee/profile` - Employee profile management

## 🔧 Development

### Adding New Protected Routes

1. **For Employer Routes**:
```typescript
<Route
  path="/employer/new-route"
  element={
    <EmployerAuthGuard>
      <YourComponent />
    </EmployerAuthGuard>
  }
/>
```

2. **For Employee Routes**:
```typescript
<Route
  path="/employee/new-route"
  element={
    <EmployeeAuthGuard>
      <YourComponent />
    </EmployeeAuthGuard>
  }
/>
```

### Working with Profile Context

```typescript
import { useProfile } from '@/contexts/ProfileContext';

function MyComponent() {
  const { profile, userType, isEmployer, isEmployee } = useProfile();
  
  // Type-safe profile access
  if (isEmployer()) {
    const employerProfile = profile as EmployerProfile;
    // Access employer-specific fields
  }
  
  if (isEmployee()) {
    const employeeProfile = profile as EmployeeProfile;
    // Access employee-specific fields
  }
}
```

### API Integration

The platform uses a centralized API client (`src/lib/api.ts`) that:
- Automatically includes JWT tokens in requests
- Handles token refresh
- Provides consistent error handling
- Supports both employer and employee endpoints

## 🛠️ Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Common Issues

1. **Authentication Errors**: Check if backend is running and JWT tokens are valid
2. **Route Access Denied**: Verify user type matches route protection
3. **Type Errors**: Ensure proper TypeScript types for profile data

## 🤝 Contributing

1. Follow the existing authentication patterns
2. Use appropriate guards for new protected routes
3. Maintain type safety with ProfileContext
4. Test both employer and employee flows
5. Update this README for new features
