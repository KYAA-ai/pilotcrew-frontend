import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';
import employerApiClient from '@/lib/api';

export function useLogout() {
  const navigate = useNavigate();
  const { clearProfile } = useProfile();

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear the cookie
      await employerApiClient.post('/employer/logout');
      
      // Clear profile from context
      clearProfile();
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to landing page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if backend call fails, clear local state and redirect
      clearProfile();
      toast.error('Logout failed, but you have been signed out locally');
      navigate('/', { replace: true });
    }
  };

  return { logout };
} 