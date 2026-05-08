"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Clock,
  Linkedin,
  Github,
  Globe,
  Loader2,
  Plus,
  X,
  Check,
  Edit2,
  Save,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { useRef, useState, useEffect } from "react";

// Profile Section Component
interface ProfileSectionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

function ProfileSection({
  title,
  description,
  icon,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  isLoading,
  children,
}: ProfileSectionProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <CardDescription>{description}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={onSave}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// Field Display Component
function FieldDisplay({
  label,
  value,
  icon: Icon,
  placeholder = "Not set",
}: {
  label: string;
  value: string | null | undefined;
  icon: React.ElementType;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className={value ? "" : "text-muted-foreground italic"}>
          {value || placeholder}
        </span>
      </div>
    </div>
  );
}

export default function CandidateProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Editing states for each section
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    phone: "",
    location: "",
    dateOfBirth: "",
  });

  const [jobProfile, setJobProfile] = useState({
    jobTitle: "",
    experienceLevel: "",
    availability: "",
    expectedSalary: "",
  });

  const [bioData, setBioData] = useState({
    bio: "",
  });

  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Fetch profile data
  const { data: profile, isLoading, isFetching } = useQuery({
    queryKey: ["candidate-profile"],
    queryFn: async () => {
      const response = await api.get("/users/profile");
      return response.data.data;
    },
    // Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
      setJobProfile({
        jobTitle: profile.jobTitle || "",
        experienceLevel: profile.experienceLevel || "",
        availability: profile.availability || "",
        expectedSalary: profile.expectedSalary || "",
      });
      setBioData({
        bio: profile.bio || "",
      });
      setSocialLinks({
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        portfolio: profile.portfolio || "",
      });
      setSkills(profile.skills || []);
    }
  }, [profile]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put("/users/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      // Immediately update the cached data with the response
      queryClient.setQueryData(["candidate-profile"], data);
      // Then invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });
      setEditingSection(null);
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  // Avatar upload mutation with optimistic update
  const avatarMutation = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const response = await api.put("/users/profile", { avatar: avatarUrl });
      return response.data;
    },
    onMutate: async (avatarUrl) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["candidate-profile"] });
      
      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(["candidate-profile"]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(["candidate-profile"], (old: any) => ({
        ...old,
        avatar: avatarUrl,
      }));
      
      return { previousProfile };
    },
    onSuccess: (data) => {
      toast.success("Profile photo updated");
      queryClient.setQueryData(["candidate-profile"], data);
      queryClient.invalidateQueries({ queryKey: ["candidate-profile"] });
      setAvatarPreview(null);
    },
    onError: (err, newAvatar, context) => {
      // Rollback on error
      queryClient.setQueryData(["candidate-profile"], context?.previousProfile);
      toast.error("Failed to update profile photo");
    },
  });

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        avatarMutation.mutate(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save for each section
  const handleSavePersonalInfo = () => {
    updateMutation.mutate({
      ...personalInfo,
      dateOfBirth: personalInfo.dateOfBirth || null,
    });
  };

  const handleSaveJobProfile = () => {
    updateMutation.mutate(jobProfile);
  };

  const handleSaveBio = () => {
    updateMutation.mutate(bioData);
  };

  const handleSaveSocialLinks = () => {
    updateMutation.mutate(socialLinks);
  };

  const handleSaveSkills = () => {
    updateMutation.mutate({ skills });
  };

  // Skill management
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (profile) {
      setPersonalInfo({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
      setJobProfile({
        jobTitle: profile.jobTitle || "",
        experienceLevel: profile.experienceLevel || "",
        availability: profile.availability || "",
        expectedSalary: profile.expectedSalary || "",
      });
      setBioData({
        bio: profile.bio || "",
      });
      setSocialLinks({
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        portfolio: profile.portfolio || "",
      });
      setSkills(profile.skills || []);
    }
    setEditingSection(null);
    setAvatarPreview(null);
  };

  // Show skeleton only on initial load when there's no data yet
  if (isLoading && !profile) {
    return (
      <div className="space-y-6 max-w-4xl">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Profile Card Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info Section Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        {/* Job Profile Section Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>

        {/* Social Links Section Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-44" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl relative">
      {/* Subtle loading overlay when refetching */}
      {isFetching && (
        <div className="absolute top-0 right-0 p-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and professional details
        </p>
      </div>

      {/* Profile Header with Avatar */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-3xl bg-indigo-100 text-indigo-600">
                    {profile?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                disabled={avatarMutation.isPending}
              >
                {avatarMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{profile?.name}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{profile?.role}</Badge>
                {profile?.isVerified && (
                  <Badge className="bg-green-100 text-green-700">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Section */}
      <ProfileSection
        title="Personal Information"
        description="Your basic contact details"
        icon={<User className="h-5 w-5 text-indigo-600" />}
        isEditing={editingSection === "personal"}
        onEdit={() => setEditingSection("personal")}
        onSave={handleSavePersonalInfo}
        onCancel={handleCancel}
        isLoading={updateMutation.isPending}
      >
        {editingSection === "personal" ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={personalInfo.name}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, phone: e.target.value })
                }
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={personalInfo.location}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, location: e.target.value })
                }
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldDisplay label="Full Name" value={profile?.name} icon={User} />
            <FieldDisplay label="Phone" value={profile?.phone} icon={Phone} placeholder="No phone number" />
            <FieldDisplay label="Location" value={profile?.location} icon={MapPin} placeholder="No location set" />
            <FieldDisplay
              label="Date of Birth"
              value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : null}
              icon={Calendar}
              placeholder="Not set"
            />
          </div>
        )}
      </ProfileSection>

      {/* Bio Section */}
      <ProfileSection
        title="About Me"
        description="Tell recruiters about yourself"
        icon={<User className="h-5 w-5 text-indigo-600" />}
        isEditing={editingSection === "bio"}
        onEdit={() => setEditingSection("bio")}
        onSave={handleSaveBio}
        onCancel={handleCancel}
        isLoading={updateMutation.isPending}
      >
        {editingSection === "bio" ? (
          <Textarea
            value={bioData.bio}
            onChange={(e) => setBioData({ bio: e.target.value })}
            rows={4}
            placeholder="Tell us about your background, interests, and career goals..."
          />
        ) : (
          <div className="text-sm">
            {profile?.bio ? (
              <p className="whitespace-pre-wrap">{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">
                No bio added yet. Click edit to add your story.
              </p>
            )}
          </div>
        )}
      </ProfileSection>

      {/* Job Profile Section */}
      <ProfileSection
        title="Job Profile"
        description="Your professional preferences"
        icon={<Briefcase className="h-5 w-5 text-indigo-600" />}
        isEditing={editingSection === "job"}
        onEdit={() => setEditingSection("job")}
        onSave={handleSaveJobProfile}
        onCancel={handleCancel}
        isLoading={updateMutation.isPending}
      >
        {editingSection === "job" ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Desired Job Title</Label>
              <Input
                id="jobTitle"
                value={jobProfile.jobTitle}
                onChange={(e) =>
                  setJobProfile({ ...jobProfile, jobTitle: e.target.value })
                }
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Input
                id="experienceLevel"
                value={jobProfile.experienceLevel}
                onChange={(e) =>
                  setJobProfile({ ...jobProfile, experienceLevel: e.target.value })
                }
                placeholder="e.g. 5+ years"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                value={jobProfile.availability}
                onChange={(e) =>
                  setJobProfile({ ...jobProfile, availability: e.target.value })
                }
                placeholder="e.g. Immediately, 2 weeks notice"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary</Label>
              <Input
                id="expectedSalary"
                value={jobProfile.expectedSalary}
                onChange={(e) =>
                  setJobProfile({ ...jobProfile, expectedSalary: e.target.value })
                }
                placeholder="e.g. $100,000 - $120,000"
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldDisplay label="Desired Job Title" value={profile?.jobTitle} icon={Briefcase} placeholder="Not specified" />
            <FieldDisplay label="Experience Level" value={profile?.experienceLevel} icon={User} placeholder="Not specified" />
            <FieldDisplay label="Availability" value={profile?.availability} icon={Clock} placeholder="Not specified" />
            <FieldDisplay label="Expected Salary" value={profile?.expectedSalary} icon={DollarSign} placeholder="Not specified" />
          </div>
        )}
      </ProfileSection>

      {/* Skills Section */}
      <ProfileSection
        title="Skills"
        description="Add your technical and soft skills"
        icon={<User className="h-5 w-5 text-indigo-600" />}
        isEditing={editingSection === "skills"}
        onEdit={() => setEditingSection("skills")}
        onSave={handleSaveSkills}
        onCancel={handleCancel}
        isLoading={updateMutation.isPending}
      >
        {editingSection === "skills" ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
              <Button type="button" onClick={handleAddSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.length > 0 ? (
              profile.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground italic text-sm">
                No skills added yet. Click edit to showcase your expertise.
              </p>
            )}
          </div>
        )}
      </ProfileSection>

      {/* Social Links Section */}
      <ProfileSection
        title="Social Links"
        description="Connect your professional profiles"
        icon={<Globe className="h-5 w-5 text-indigo-600" />}
        isEditing={editingSection === "social"}
        onEdit={() => setEditingSection("social")}
        onSave={handleSaveSocialLinks}
        onCancel={handleCancel}
        isLoading={updateMutation.isPending}
      >
        {editingSection === "social" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={socialLinks.linkedin}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={socialLinks.github}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, github: e.target.value })
                }
                placeholder="https://github.com/username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio Website</Label>
              <Input
                id="portfolio"
                value={socialLinks.portfolio}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, portfolio: e.target.value })
                }
                placeholder="https://yourportfolio.com"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {profile?.linkedin ? (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
              >
                <Linkedin className="h-4 w-4" />
                {profile.linkedin}
              </a>
            ) : (
              <FieldDisplay label="LinkedIn" value={null} icon={Linkedin} />
            )}
            {profile?.github ? (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
              >
                <Github className="h-4 w-4" />
                {profile.github}
              </a>
            ) : (
              <FieldDisplay label="GitHub" value={null} icon={Github} />
            )}
            {profile?.portfolio ? (
              <a
                href={profile.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
              >
                <Globe className="h-4 w-4" />
                {profile.portfolio}
              </a>
            ) : (
              <FieldDisplay label="Portfolio" value={null} icon={Globe} />
            )}
          </div>
        )}
      </ProfileSection>
    </div>
  );
}