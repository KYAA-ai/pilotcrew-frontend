import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useLogout } from '@/hooks/useLogout';
import { toast } from 'sonner';
import employerApiClient from '@/lib/api';
import { EmployerLayout } from '@/components/layout/EmployerLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Edit,
  Save,
  X,
  Mail,
  Building,
  Globe,
  User,
  Logout,
} from '@/components/SimpleIcons';

interface EmployerProfile {
  id: string;
  email: string;
  name: string;
  companyName: string;
  companyWebsite?: string;
  isEmailVerified: boolean;
}

export default function EmployerProfile() {
  const { profile, setProfile } = useProfile<EmployerProfile>();
  const { logout } = useLogout();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    companyName: profile?.companyName || '',
    companyWebsite: profile?.companyWebsite || '',
  });

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsLoading(true);
    try {
      const response = await employerApiClient.put('/v1/employer/profile', formData);
      
      if (response.status === 200) {
        setProfile({
          ...profile,
          ...response.data.employer,
        });
        
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      companyName: profile?.companyName || '',
      companyWebsite: profile?.companyWebsite || '',
    });
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <EmployerLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading profile...</p>
          </div>
        </div>
      </EmployerLayout>
    );
  }

  return (
    <EmployerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <Logout className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>
                  Update your personal and company details
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 rounded-lg">
                <AvatarFallback className="rounded-lg text-lg">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="font-medium">{profile.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{profile.email}</p>
                    {profile.isEmailVerified ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        Not Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="grid grid-cols-1 gap-4 pt-4 border-t">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Company Name
                </Label>
                {isEditing ? (
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter your company name"
                  />
                ) : (
                  <p className="font-medium">{profile.companyName}</p>
                )}
              </div>

              {/* Company Website */}
              <div className="space-y-2">
                <Label htmlFor="companyWebsite" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Company Website
                </Label>
                {isEditing ? (
                  <Input
                    id="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                ) : (
                  <div>
                    {profile.companyWebsite ? (
                      <a
                        href={profile.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        {profile.companyWebsite}
                      </a>
                    ) : (
                      <p className="text-gray-500 italic text-sm">No website provided</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployerLayout>
  );
} 