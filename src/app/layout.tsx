import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "HireIQ - AI-Powered Smart Recruitment Platform",
  description: "Find your dream job or hire the best talent with AI-powered matching. Resume analysis, job description generation, candidate ranking, and interview coaching.",
  keywords: "jobs, recruitment, hiring, AI, resume, career, employment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
