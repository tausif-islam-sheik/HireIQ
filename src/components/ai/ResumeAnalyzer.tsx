"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";

interface ResumeAnalysisProps {
  analysis: {
    overallScore?: number;
    matchPercentage?: number;
    strengths?: string[];
    gaps?: string[];
    suggestions?: string[];
    verdict?: string;
  };
}

export function ResumeAnalyzer({ analysis }: ResumeAnalysisProps) {
  const {
    overallScore = 0,
    matchPercentage = 0,
    strengths = [],
    gaps = [],
    suggestions = [],
    verdict = "No analysis available",
  } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="text-center">
        <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
          {overallScore}%
        </div>
        <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
        <Badge
          variant="secondary"
          className={`mt-2 ${
            verdict.includes("Strong")
              ? "bg-green-100 text-green-700"
              : verdict.includes("Moderate")
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {verdict}
        </Badge>
      </div>

      {/* Match Percentage */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Job Match</span>
          <span className={getScoreColor(matchPercentage)}>{matchPercentage}%</span>
        </div>
        <Progress
          value={matchPercentage}
          className="h-2"
        />
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div>
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li
                key={index}
                className="text-sm flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {gaps.length > 0 && (
        <div>
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            Areas to Improve
          </h4>
          <ul className="space-y-2">
            {gaps.map((gap, index) => (
              <li
                key={index}
                className="text-sm flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950 rounded-lg"
              >
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-indigo-600" />
            Suggestions
          </h4>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-sm flex items-start gap-2 p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg"
              >
                <Lightbulb className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
