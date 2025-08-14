import {
    Award,
    Briefcase,
    Edit,
    FileText,
    Globe,
    Mail,
    Phone,
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

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume?: string;
  skills?: string;
  experience?: string;
  headline: string;
  linkedinId?: string;
  linkedinName?: string;
  linkedinEmailVerified?: boolean;
  linkedinPicture?: string;
  linkedinProfileUrl?: string;
  isEmailVerified?: boolean;
}

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeProfileModal({ isOpen, onClose }: EmployeeProfileModalProps) {
  const { profile, setProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const employeeProfile = profile as EmployeeProfile;
  
  const [formData, setFormData] = useState({
    name: employeeProfile?.name || '',
    phone: employeeProfile?.phone || '',
    skills: employeeProfile?.skills || '',
    experience: employeeProfile?.experience || '',
    headline: employeeProfile?.headline || '',
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
      const response = await apiClient.put('/v1/employee/profile', formData);
      
      if (response.status === 200) {
        setProfile({
          ...profile,
          ...response.data.employee,
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
      name: employeeProfile?.name || '',
      phone: employeeProfile?.phone || '',
      skills: employeeProfile?.skills || '',
      experience: employeeProfile?.experience || '',
      headline: employeeProfile?.headline || '',
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Employee Profile</DialogTitle>
              <DialogDescription>
                Manage your professional information and preferences
              </DialogDescription>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                className="flex items-center gap-2 mr-8"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
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
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarFallback className="rounded-lg text-lg">
                {getInitials(employeeProfile?.linkedinName || employeeProfile?.name || 'User')}
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
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="font-medium">{employeeProfile?.name || 'Not provided'}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{employeeProfile?.email || 'Not provided'}</p>
                  {employeeProfile?.linkedinEmailVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      LinkedIn Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                ) : (
                  <p className="text-sm">{employeeProfile?.phone || "Not provided"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-1 gap-4 pt-4 border-t">
            {/* Headline */}
            <div className="space-y-2">
              <Label htmlFor="headline" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Professional Headline
              </Label>
              {isEditing ? (
                <Input
                  id="headline"
                  name="headline"
                  value={formData.headline}
                  onChange={(e) => handleInputChange('headline', e.target.value)}
                  placeholder="e.g., Software Engineer, Product Manager"
                />
              ) : (
                <p className="font-medium">{employeeProfile?.headline || "No headline provided"}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Skills
              </Label>
              {isEditing ? (
                <Input
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  placeholder="JavaScript, React, Node.js, Python"
                />
              ) : (
                <div>
                  {employeeProfile?.skills ? (
                    <div className="flex flex-wrap gap-1">
                      {employeeProfile.skills.split(',').map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">No skills listed</p>
                  )}
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Experience
              </Label>
              {isEditing ? (
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  rows={4}
                  placeholder="Describe your work experience..."
                  className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 shadow-xs focus-visible:ring-[3px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {employeeProfile?.experience || "No experience listed"}
                </p>
              )}
            </div>

            {/* Resume */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resume
              </Label>
              <div>
                {employeeProfile?.resume ? (
                  <a
                    href={employeeProfile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View Resume
                  </a>
                ) : (
                  <p className="text-gray-500 italic text-sm">No resume uploaded</p>
                )}
              </div>
            </div>

            {/* LinkedIn Information */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                LinkedIn Profile
              </Label>
              <div className="flex items-center gap-2">
                {employeeProfile?.linkedinProfileUrl ? (
                  <a
                    href={employeeProfile.linkedinProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View LinkedIn Profile
                  </a>
                ) : (
                  <p className="text-gray-500 italic text-sm">No LinkedIn profile linked</p>
                )}
                {employeeProfile?.linkedinId && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Connected
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 