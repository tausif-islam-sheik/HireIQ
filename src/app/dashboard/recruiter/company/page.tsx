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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Globe, Users, MapPin, Upload, Loader2, Building, Plus, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRef, useState } from "react";

export default function RecruiterCompanyPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: company, isLoading } = useQuery({
    queryKey: ["my-company"],
    queryFn: async () => {
      const response = await api.get("/companies/my");
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post("/companies", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Company profile created successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-company"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create company profile");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.put("/companies/my", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Company profile updated");
      queryClient.invalidateQueries({ queryKey: ["my-company"] });
    },
    onError: () => {
      toast.error("Failed to update company profile");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!company) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("logo", file);
      updateMutation.mutate(formData);
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Show create form if no company exists
  const isCreating = !company && !isLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isCreating ? "Create Company Profile" : "Company Profile"}
        </h1>
        <p className="text-muted-foreground">
          {isCreating 
            ? "Set up your company profile to start posting jobs"
            : "Manage your company information visible to candidates"}
        </p>
      </div>

      {isCreating && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-800">
            You need to create a company profile before you can post jobs.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer group"
                onClick={handleLogoClick}
              >
                <Avatar className="w-20 h-20">
                  {company?.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600">
                      {company?.name?.charAt(0) || "C"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div>
                <p className="font-medium">Company Logo</p>
                <p className="text-sm text-muted-foreground">
                  Recommended: 400x400px, PNG or JPG
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={company?.name || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  defaultValue={company?.website || ""}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  defaultValue={company?.industry || ""}
                  placeholder="e.g. Technology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Input
                  id="size"
                  name="size"
                  defaultValue={company?.size || ""}
                  placeholder="e.g. 50-200 employees"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={company?.location || ""}
                placeholder="e.g. San Francisco, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                defaultValue={company?.description || ""}
                placeholder="Tell candidates about your company, mission, and culture..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={updateMutation.isPending || createMutation.isPending}
          >
            {updateMutation.isPending || createMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isCreating ? "Creating..." : "Saving..."}
              </>
            ) : (
              isCreating ? "Create Company Profile" : "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
