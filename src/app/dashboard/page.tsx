"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case "ADMIN":
          router.replace("/dashboard/admin");
          break;
        case "RECRUITER":
          router.replace("/dashboard/recruiter");
          break;
        case "CANDIDATE":
          router.replace("/dashboard/candidate");
          break;
        default:
          router.replace("/dashboard/candidate");
      }
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
