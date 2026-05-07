import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatDate } from "@/lib/utils";

interface Application {
  id: string;
  status: string;
  createdAt: string;
  candidate: {
    name: string;
    email: string;
  };
  job: {
    title: string;
    company: {
      name: string;
    };
  };
}

interface RecentActivityProps {
  applications: Application[];
  title?: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-700",
  REVIEWING: "bg-blue-500/10 text-blue-700",
  SHORTLISTED: "bg-purple-500/10 text-purple-700",
  REJECTED: "bg-red-500/10 text-red-700",
  HIRED: "bg-green-500/10 text-green-700",
};

export function RecentActivity({ applications, title = "Recent Applications" }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent applications
            </p>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="flex items-center gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" />
                  <AvatarFallback>{getInitials(app.candidate.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{app.candidate.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Applied to {app.job.title} at {app.job.company.name}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary" className={statusColors[app.status] || "bg-gray-500/10 text-gray-700"}>
                    {app.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(app.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
