// import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProfile } from '@/contexts/ProfileContext';
import apiClient from '@/lib/api';

export function useLogout() {
  // const navigate = useNavigate();
  const { clearProfile, userType } = useProfile();

  const logout = async () => {
    try {
      const logoutEndpoints = {
        employer: '/v1/employer/logout',
        employee: '/v1/employee/logout'
      };

      if (userType && logoutEndpoints[userType]) {
        await apiClient.post(logoutEndpoints[userType]);
      }

      clearProfile();
      toast.success('Logged out successfully');
      window.location.href = '/';
      //navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      clearProfile();
      toast.error('Logout failed, but you have been signed out locally');
      window.location.href = '/';
      //navigate('/', { replace: true });
    }
  };

  return { logout };
} 