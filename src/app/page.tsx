"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bug,
  CalendarDays,
  Users,
  Clock,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  // If already logged in, redirect to dashboard
  if (user) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Hero */}
      <div className="container mx-auto px-4 pt-16 pb-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary text-primary-foreground">
            <Bug className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          June Bug Center
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Volunteer Hub &mdash; Sign up for shifts, track your hours, and help
          our community thrive.
        </p>
        <Button size="lg" onClick={() => router.push("/login")}>
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Feature cards */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="pb-3">
              <CalendarDays className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Browse Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View available volunteer shifts and sign up in seconds.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Track Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See your completed hours and build your volunteer history.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Manage Volunteers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Staff can approve signups, track attendance, and fill gaps.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Stay Notified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get reminders before your shifts so you never miss one.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
