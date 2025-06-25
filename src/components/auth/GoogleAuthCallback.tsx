import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export function GoogleAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = () => {
      const token = searchParams.get('token');
      if (token) {
          localStorage.setItem('employer-token', token);
          toast.success('Google authentication successful!');
          navigate('/employer/dashboard');
      } else {
        toast.error('No token received from authentication. Authentication failed.');
        navigate('/employer/auth');

      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
} 