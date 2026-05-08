"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="p-4 rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={onAction}
          {...(actionHref ? { as: "a", href: actionHref } : {})}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
