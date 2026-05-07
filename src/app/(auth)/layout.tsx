export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-950/20 dark:via-background dark:to-cyan-950/20">
      {children}
    </main>
  );
}
