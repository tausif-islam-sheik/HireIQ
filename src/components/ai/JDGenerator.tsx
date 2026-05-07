"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Plus, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface JDGeneratorProps {
  onApply: (generated: {
    title: string;
    summary: string;
    responsibilities: string[];
    requirements: string[];
    niceToHave: string[];
    benefits: string[];
  }) => void;
  onClose: () => void;
}

export function JDGenerator({ onApply, onClose }: JDGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJD, setGeneratedJD] = useState<{
    title: string;
    summary: string;
    responsibilities: string[];
    requirements: string[];
    niceToHave: string[];
    benefits: string[];
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    experience: "",
    type: "FULL_TIME",
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleGenerate = async () => {
    if (!formData.title || formData.skills.length === 0) {
      toast.error("Please fill in the job title and at least one skill");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/ai/generate-jd", {
        title: formData.title,
        skills: formData.skills,
        experience: formData.experience,
        type: formData.type,
      });
      setGeneratedJD(response.data.data);
      toast.success("Job description generated!");
    } catch {
      toast.error("Failed to generate job description");
    } finally {
      setIsGenerating(false);
    }
  };

  if (generatedJD) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{generatedJD.title}</h3>
          <p className="text-sm text-muted-foreground">{generatedJD.summary}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Responsibilities</h4>
          <ul className="text-sm space-y-1">
            {generatedJD.responsibilities.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-600">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Requirements</h4>
          <ul className="text-sm space-y-1">
            {generatedJD.requirements.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {generatedJD.niceToHave.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Nice to Have</h4>
            <ul className="text-sm space-y-1">
              {generatedJD.niceToHave.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            onClick={() => onApply(generatedJD)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Apply to Form
          </Button>
          <Button variant="outline" onClick={() => setGeneratedJD(null)}>
            Regenerate
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Job Title</Label>
        <Input
          placeholder="e.g. Senior Software Engineer"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Experience Level</Label>
        <Select
          value={formData.experience}
          onValueChange={(value: string) =>
            setFormData({ ...formData, experience: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Entry Level">Entry Level</SelectItem>
            <SelectItem value="Mid Level">Mid Level</SelectItem>
            <SelectItem value="Senior Level">Senior Level</SelectItem>
            <SelectItem value="Lead/Manager">Lead/Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Job Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: string) =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FULL_TIME">Full Time</SelectItem>
            <SelectItem value="PART_TIME">Part Time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="REMOTE">Remote</SelectItem>
            <SelectItem value="INTERNSHIP">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Key Skills (add at least 3)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. React, Python, AWS"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" onClick={handleAddSkill}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Job Description
          </>
        )}
      </Button>
    </div>
  );
}
