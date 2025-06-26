import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';
import employerApiClient from '@/lib/api';

export function GoogleAuthCallback() {
  const navigate = useNavigate();
  const { setProfile } = useProfile();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The cookie is already set by the backend, so we can directly call the profile endpoint
        const response = await employerApiClient.get('/employer/profile');
        
        if (response.status === 200) {
          // Set profile information in context
          setProfile(response.data.employer);
          toast.success('Google authentication successful!');
          navigate('/employer/dashboard');
        } else {
          toast.error('Authentication failed. Please try again.');
          navigate('/auth/employer');
        }
      } catch (error) {
        console.error('Google auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/auth/employer');
      }
    };

    handleCallback();
  }, [navigate, setProfile]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
} 