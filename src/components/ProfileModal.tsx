import {
    Building,
    Edit,
    Globe,
    Mail,
    Save,
    User,
    X,
} from '@/components/SimpleIcons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/contexts/ProfileContext';
import apiClient from '@/lib/api';
import { useState } from 'react';
import { toast } from 'sonner';

interface EmployerProfile {
  id: string;
  email: string;
  name: string;
  companyName: string;
  companyWebsite?: string;
  isEmailVerified: boolean;
}

interface EmployerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmployerProfileModal({ isOpen, onClose }: EmployerProfileModalProps) {
  const { profile, setProfile } = useProfile<EmployerProfile>();
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
      const response = await apiClient.put('/v1/employer/profile', formData);
      
      if (response.status === 200) {
        // Update profile in context
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

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  if (!profile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Client Profile Settings</DialogTitle>
              <DialogDescription>
                                  Manage your client account information
              </DialogDescription>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                className="flex items-center gap-2 mr-8"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2 mr-8">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4 " />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarFallback className="rounded-lg text-lg">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    size={1}
                  />
                ) : (
                  <p className="font-medium">{profile.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
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
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                        Not Verified
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          window.location.href = `${import.meta.env.VITE_API_URL}/employer/auth/google`;
                        }}
                        className="flex items-center gap-1 text-xs h-6 px-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3 w-3">
                          <path d="M21.35 11.1h-9.09v3.7h5.82c-.25 1.46-1.5 4.3-5.82 4.3-3.5 0-6.36-2.9-6.36-6.5s2.86-6.5 6.36-6.5c2 0 3.34.88 4.09 1.63l2.8-2.8C17.57 2.46 15.46 1.5 12.32 1.5 6.46 1.5 2 5.93 2 11.7s4.46 10.2 10.32 10.2c5.93 0 9.82-4.16 9.82-10.07 0-.84-.08-1.43-.18-2.73z"/>
                        </svg>
                        Verify
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 gap-4 pt-4 border-t">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4" />
                Company Name
              </Label>
              {isEditing ? (
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  size={1}
                />
              ) : (
                <p className="font-medium">{profile.companyName}</p>
              )}
            </div>

            {/* Company Website */}
            <div className="space-y-2">
              <Label htmlFor="companyWebsite" className="flex items-center gap-2 text-sm">
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
                  size={1}
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
        </div>
      </DialogContent>
    </Dialog>
  );
} 