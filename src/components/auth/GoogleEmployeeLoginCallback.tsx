import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function GoogleEmployeeLoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        toast.success('Google authentication successful!');
        navigate('/employee/recommended-jobs');
      } catch (error) {
        console.error('Google auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/auth/employee');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Completing Google authentication...</p>
      </div>
    </div>
  );
} 