import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface EmployerProfile {
  id: string;
  email: string;
  name: string;
  companyName: string;
  companyWebsite?: string;
  isEmailVerified: boolean;
}

interface EmployeeProfile {
  id: string;
  headline: string;
  linkedinId?: string;
  linkedinName?: string;
  linkedinEmailVerified?: boolean;
  linkedinPicture?: string;
  linkedinProfileUrl?: string;
  isEmailVerified?: boolean;
}

type Profile = EmployerProfile | EmployeeProfile;
type UserType = 'employer' | 'employee' | null;

interface ProfileContextType {
  profile: Profile | null;
  userType: UserType;
  setProfile: (profile: Profile | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearProfile: () => void;
  isEmployer: () => boolean;
  isEmployee: () => boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedUserType = localStorage.getItem('userType') as UserType;
    
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileState(parsedProfile);
        setUserType(savedUserType);
      } catch (error) {
        console.error('Error parsing saved profile:', error);
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userType');
      }
    }
  }, []);

  //REVISIT
  const setProfile = (newProfile: Profile | null) => {
    setProfileState(newProfile);
    if (newProfile) {
      const type: UserType = 'companyName' in newProfile ? 'employer' : 'employee';
      setUserType(type);
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      localStorage.setItem('userType', type);
    } else {
      setUserType(null);
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userType');
    }
  };

  const clearProfile = () => {
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

  const value = {
    profile,
    userType,
    setProfile,
    isLoading,
    setIsLoading,
    clearProfile,
    isEmployer,
    isEmployee,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
} 