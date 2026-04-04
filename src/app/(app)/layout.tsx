"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (!user) return null;

  return <AppShell>{children}</AppShell>;
}
