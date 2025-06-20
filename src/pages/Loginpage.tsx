import { LoginForm } from '@/components/login-form'
import { SignupForm } from '@/components/signup-form'

export default function LoginPage({ mode }: { mode: 'login' | 'signup' }) {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {mode === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  )
}
