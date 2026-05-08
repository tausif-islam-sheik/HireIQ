"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResumeAnalyzer } from "@/components/ai/ResumeAnalyzer";
import { Resume } from "@/types";
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, Sparkles, Download } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { toast } from "sonner";

export default function CandidateResumePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: resume, isLoading } = useQuery({
    queryKey: ["my-resume"],
    queryFn: async () => {
      const response = await api.get("/resumes/my");
      return response.data.data as Resume | null;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Resume uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-resume"] });
      setIsUploading(false);
    },
    onError: (error: any) => {
      console.error("Resume upload error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to upload resume";
      toast.error(errorMessage);
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      e.target.value = "";
      return;
    }
    
    const validTypes = [
      "application/pdf",
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    
    const isValidType = validTypes.includes(file.type);
    const isValidExtension = validExtensions.includes(fileExtension);
    
    if (!isValidType && !isValidExtension) {
      toast.error(`Invalid file type. Only PDF and Word documents are allowed.`);
      e.target.value = "";
      return;
    }
    
    try {
      setIsUploading(true);
      await uploadMutation.mutateAsync(file);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resume & AI Analysis</h1>
        <p className="text-muted-foreground">
          Upload your resume and get AI-powered insights
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resume Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Resume
            </CardTitle>
            <CardDescription>
              Upload your resume in PDF or Word format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!resume ? (
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium mb-1">Upload your resume</p>
                <p className="text-sm text-muted-foreground mb-4">
                  PDF or Word up to 5MB
                </p>
                <Button
                  type="button"
                  onClick={handleUploadClick}
                  variant="outline"
                  className="hover:border-indigo-500 hover:text-indigo-500"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Resume uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Resume
                    </>
                  )}
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                AI analysis works best with well-structured resumes that clearly list
                skills, experience, and education.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* AI Analysis Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              AI Resume Analysis
            </CardTitle>
            <CardDescription>
              Get insights about your resume strengths and areas for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resume?.aiAnalysis ? (
              <ResumeAnalyzer analysis={resume.aiAnalysis} />
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No AI analysis yet"
                description="Upload your resume to get AI-powered analysis of your skills and experience."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
