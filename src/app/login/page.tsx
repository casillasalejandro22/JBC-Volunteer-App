"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bug, HandHeart, ShieldCheck } from "lucide-react";

// TODO: Replace with Firebase Auth login form
// This is a placeholder role-selection page for demo purposes.
// In production, use Firebase Auth sign-in and fetch the user role from Firestore.

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleLogin = async (role: "volunteer" | "staff") => {
    await login(role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Bug className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to JBC Volunteer Hub</h1>
          <p className="text-muted-foreground mt-1">
            Choose your role to continue
          </p>
        </div>

        <div className="grid gap-4">
          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg border-2 hover:border-primary/50"
            onClick={() => !isLoading && handleLogin("volunteer")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <HandHeart className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <CardTitle className="text-lg">Volunteer</CardTitle>
                  <CardDescription>
                    Browse shifts, sign up, and track your hours
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Continue as Volunteer"}
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-shadow hover:shadow-lg border-2 hover:border-primary/50"
            onClick={() => !isLoading && handleLogin("staff")}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <ShieldCheck className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <CardTitle className="text-lg">Staff</CardTitle>
                  <CardDescription>
                    Manage shifts, approve signups, track attendance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Continue as Staff"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          This is a demo login. In production, this will use Firebase
          Authentication.
        </p>
      </div>
    </div>
  );
}
