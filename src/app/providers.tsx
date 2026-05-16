"use client";

import { ThemeProvider } from "next-themes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "sonner";
import { useAuthInit } from "@/hooks/useAuthInit";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize auth state from localStorage
  useAuthInit();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SmoothScrollProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}
