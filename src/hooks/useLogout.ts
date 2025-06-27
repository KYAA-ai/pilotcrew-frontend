import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';
import apiClient from '@/lib/api';

export function useLogout() {
  const navigate = useNavigate();
  const { clearProfile, userType } = useProfile();

  const logout = async () => {
    try {
      // Call the appropriate logout endpoint based on user type
      const logoutEndpoints = {
        employer: '/employer/logout',
        employee: '/auth/logout'
      };

      if (userType && logoutEndpoints[userType]) {
        await apiClient.post(logoutEndpoints[userType]);
      }

      clearProfile();
      toast.success('Logged out successfully');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      clearProfile();
      toast.error('Logout failed, but you have been signed out locally');
      navigate('/', { replace: true });
    }
  };

  return { logout };
} 