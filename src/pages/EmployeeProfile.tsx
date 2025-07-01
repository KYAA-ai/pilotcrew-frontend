import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import { useProfile } from "@/contexts/ProfileContext";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  FileText,
  Briefcase,
  Award,
  Globe,
  Edit,
  Save,
  X,
} from "@/components/SimpleIcons";

export default function EmployeeProfile() {
  const { profile, setProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const employeeProfile = profile as {
    name?: string;
    email?: string;
    phone?: string;
    resume?: string;
    skills?: string;
    experience?: string;
    headline?: string;
    linkedinId?: string;
    linkedinName?: string;
    linkedinEmailVerified?: boolean;
    linkedinPicture?: string;
    linkedinProfileUrl?: string;
  };

  const [form, setForm] = useState({
    name: employeeProfile?.name || "",
    phone: employeeProfile?.phone || "",
    skills: employeeProfile?.skills || "",
    experience: employeeProfile?.experience || "",
    headline: employeeProfile?.headline || "",
  });

  const isValid = form.name.trim() && form.phone.trim();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await apiClient.put('/employee/profile', form);
      
      if (response.status === 200) {
        setProfile({
          ...profile!,
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
    setForm({
      name: employeeProfile?.name || "",
      phone: employeeProfile?.phone || "",
      skills: employeeProfile?.skills || "",
      experience: employeeProfile?.experience || "",
      headline: employeeProfile?.headline || "",
    });
    setIsEditing(false);
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!profile) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading profile...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employee Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your professional information and preferences
            </p>
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
                onClick={handleSubmit}
                disabled={isLoading || !isValid}
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

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 rounded-lg">
                <AvatarFallback className="rounded-lg text-lg">
                  {getInitials(employeeProfile?.linkedinName || employeeProfile?.name || 'Employee')}
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
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="font-medium">{employeeProfile?.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{employeeProfile?.email}</p>
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
                      value={form.phone}
                      onChange={handleChange}
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
                    value={form.headline}
                    onChange={handleChange}
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
                    value={form.skills}
                    onChange={handleChange}
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
                    value={form.experience}
                    onChange={handleChange}
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
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
} 