"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/app-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!token) {
        router.replace("/login");
      } else if (!isAdmin) {
        router.replace("/dashboard");
      }
    }
  }, [token, isLoading, isAdmin, router]);

  if (isLoading || !token || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
