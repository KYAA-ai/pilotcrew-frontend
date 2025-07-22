import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import {
    Award,
    Briefcase,
    FileText,
    Globe,
    Mail,
    Phone,
    User,
    MapPin,
    Calendar,
    GraduationCap,
    Building,
} from "@/components/SimpleIcons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useProfile } from "@/contexts/ProfileContext";
import { useState } from "react";

export default function EmployeeProfile() {
  const { profile } = useProfile();
  const [isEditing] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("resume");

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
    llamaResumeInfo?: {
      profile?: {
        name?: string;
        email?: string;
        phone?: string;
        location?: {
          city?: string;
          region?: string;
          country?: string;
        };
        profiles?: Array<{
          network?: string;
          url?: string;
        }>;
        summary?: string;
      };
      skills?: Array<{
        category?: string;
        keywords?: string[];
        level?: string;
      }>;
      experience?: Array<{
        company?: string;
        position?: string;
        startDate?: string;
        endDate?: string;
        highlights?: string[];
        technologies?: string[];
      }>;
      education?: Array<{
        institution?: string;
        degree?: string;
        field?: string;
        graduationDate?: string;
        gpa?: number;
      }>;
      certifications?: Array<{
        name?: string;
        issuer?: string;
        date?: string;
      }> | null;
      publications?: Array<{
        title?: string;
        authors?: string[];
        date?: string;
        url?: string;
      }> | null;
    };
  };

  const [form, setForm] = useState({
    name: employeeProfile?.name || "",
    phone: employeeProfile?.phone || "",
    skills: employeeProfile?.skills || "",
    experience: employeeProfile?.experience || "",
    headline: employeeProfile?.headline || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  // Helper function to format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  // Helper function to format location
  const formatLocation = (location: {
    city?: string;
    region?: string;
    country?: string;
  } | undefined) => {
    if (!location) return '';
    const parts = [location.city, location.region, location.country].filter(Boolean);
    return parts.join(', ');
  };

  if (!profile) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm 600">Loading profile...</p>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employee Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your professional information and preferences
            </p>
          </div>
          {/* {!isEditing ? (
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
          )} */}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          {/* Resume Details Tab */}
          <TabsContent value="resume" className="space-y-6">
            {employeeProfile?.llamaResumeInfo ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Resume Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Profile Info */}
                  {employeeProfile.llamaResumeInfo.profile && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {employeeProfile.llamaResumeInfo.profile.name && (
                          <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-sm font-medium 600">
                              <User className="h-4 w-4" />
                              Name
                            </Label>
                            <p className="text-sm">{employeeProfile.llamaResumeInfo.profile.name}</p>
                          </div>
                        )}
                        
                        {employeeProfile.llamaResumeInfo.profile.email && (
                          <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-sm font-medium 600">
                              <Mail className="h-4 w-4" />
                              Email
                            </Label>
                            <p className="text-sm">{employeeProfile.llamaResumeInfo.profile.email}</p>
                          </div>
                        )}

                        {employeeProfile.llamaResumeInfo.profile.phone && (
                          <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-sm font-medium 600">
                              <Phone className="h-4 w-4" />
                              Phone
                            </Label>
                            <p className="text-sm">{employeeProfile.llamaResumeInfo.profile.phone}</p>
                          </div>
                        )}

                        {employeeProfile.llamaResumeInfo.profile.location && (
                          <div className="space-y-1">
                            <Label className="flex items-center gap-2 text-sm font-medium 600">
                              <MapPin className="h-4 w-4" />
                              Location
                            </Label>
                            <p className="text-sm">{formatLocation(employeeProfile.llamaResumeInfo.profile.location)}</p>
                          </div>
                        )}
                      </div>

                      {/* Social Profiles */}
                      {employeeProfile.llamaResumeInfo.profile.profiles && employeeProfile.llamaResumeInfo.profile.profiles.length > 0 && (
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm font-medium 600">
                            <Globe className="h-4 w-4" />
                            Social Profiles
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {employeeProfile.llamaResumeInfo.profile.profiles.map((profile, index) => (
                              <a
                                key={index}
                                href={`https://${profile.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                              >
                                {profile.network}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skills */}
                  {employeeProfile.llamaResumeInfo.skills && employeeProfile.llamaResumeInfo.skills.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Skills</h3>
                      <div className="space-y-4">
                        {employeeProfile.llamaResumeInfo.skills.map((skillCategory, index) => (
                          <div key={index} className="space-y-2">
                            <h4 className="font-medium text-sm 700">{skillCategory.category}</h4>
                            <div className="flex flex-wrap gap-2">
                              {skillCategory.keywords?.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {employeeProfile.llamaResumeInfo.experience && employeeProfile.llamaResumeInfo.experience.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Experience</h3>
                      <div className="space-y-6">
                        {employeeProfile.llamaResumeInfo.experience.map((exp, index) => (
                          <div key={index} className="border-l-2 border-gray-200 pl-4 space-y-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 500" />
                                <h4 className="font-semibold text-sm">{exp.position}</h4>
                              </div>
                              <p className="text-sm">{exp.company}</p>
                              <div className="flex items-center gap-2 text-xs 500">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}
                                </span>
                              </div>
                            </div>

                            {/* Highlights */}
                            {exp.highlights && exp.highlights.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-xs font-medium">Key Achievements:</h5>
                                <ul className="space-y-1">
                                  {exp.highlights.map((highlight, highlightIndex) => (
                                    <li key={highlightIndex} className="text-xs list-disc list-inside">
                                      {highlight}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Technologies */}
                            {exp.technologies && exp.technologies.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-xs font-medium">Technologies:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {exp.technologies.map((tech, techIndex) => (
                                    <Badge key={techIndex} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {employeeProfile.llamaResumeInfo.education && employeeProfile.llamaResumeInfo.education.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Education</h3>
                      <div className="space-y-4">
                        {employeeProfile.llamaResumeInfo.education.map((edu, index) => (
                          <div key={index} className="border-l-2 border-gray-200 pl-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 500" />
                              <h4 className="font-semibold text-sm">{edu.degree} in {edu.field}</h4>
                            </div>
                            <p className="text-sm 600">{edu.institution}</p>
                            <div className="flex items-center gap-4 text-xs 500">
                              <span>Graduated: {formatDate(edu.graduationDate)}</span>
                              {edu.gpa && <span>GPA: {edu.gpa}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium 900 mb-2">No Resume Information</h3>
                    <p className="500 text-sm">
                      Resume details will appear here once your resume is processed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
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
                          <p className="500 italic text-sm">No skills listed</p>
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
                        <p className="500 italic text-sm">No resume uploaded</p>
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
                        <p className="500 italic text-sm">No LinkedIn profile linked</p>
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
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
} 