import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface EmployerProfile {
  id: string;
  email: string;
  name: string;
  companyName: string;
  companyWebsite?: string;
  isEmailVerified: boolean;
  userType: string;
}

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  headline: string;
  linkedinId?: string;
  linkedinName?: string;
  linkedinEmailVerified?: boolean;
  linkedinPicture?: string;
  linkedinProfileUrl?: string;
  isEmailVerified?: boolean;
  userType: string;
}

interface AutoEvalProfile {
  id: string;
  name: string;
  email: string;
  permissions?: string[];
  isAdmin?: boolean;
  userType: string;
}

type Profile = EmployerProfile | EmployeeProfile | AutoEvalProfile;
type UserType = 'employer' | 'employee' | 'autoeval' | null;

interface ProfileContextType {
  profile: Profile | null;
  userType: UserType;
  setProfile: (profile: Profile | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearProfile: () => void;
  isEmployer: () => boolean;
  isEmployee: () => boolean;
  isAutoEval: () => boolean;
  isLoggingOut: boolean;
  // Permission helpers for AutoEval users
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  //REVISIT
  const setProfile = (newProfile: Profile | null) => {
    setProfileState(newProfile);
    if (newProfile) {
      let type: UserType = null;
      if(newProfile?.userType == 'EMPLOYER') {
        type = 'employer'
      } else if(newProfile?.userType == 'EMPLOYEE') {
        type = 'employee'
      } else if(newProfile?.userType == 'AUTO_EVAL') {
        type = 'autoeval'
      }
      setUserType(type);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      localStorage.setItem('userType', type || '');
      setIsLoggingOut(false);
    } else {
      setUserType(null);
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userType');
    }
  };

  const clearProfile = () => {
    setIsLoggingOut(true);
    setProfileState(null);
    setUserType(null);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userType');
  };

  const isEmployer = (): boolean => {
    return userType === 'employer';
  };

  const isEmployee = (): boolean => {
    return userType === 'employee';
  };

  const isAutoEval = (): boolean => {
    return userType === 'autoeval';
  };

  // Permission helpers for AutoEval users
  const hasPermission = (permission: string): boolean => {
    if (userType !== 'autoeval' || !profile) return false;
    const autoEvalProfile = profile as AutoEvalProfile;
    return autoEvalProfile.permissions?.includes(permission) || false;
  };

  const isAdmin = userType === 'autoeval' && (profile as AutoEvalProfile)?.isAdmin || false;

  const value = {
    profile,
    userType,
    setProfile,
    isLoading,
    setIsLoading,
    clearProfile,
    isEmployer,
    isEmployee,
    isAutoEval,
    isLoggingOut,
    hasPermission,
    isAdmin,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// Generic hook that returns the profile as the specified type
function useProfile<T extends Profile = Profile>() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return {
    ...context,
    profile: context.profile as T | null,
  };
}

// Export the generic hook
// eslint-disable-next-line react-refresh/only-export-components
export { useProfile };

