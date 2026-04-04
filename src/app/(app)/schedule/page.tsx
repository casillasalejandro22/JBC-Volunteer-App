"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Shift, Signup } from "@/lib/types";
import { getSignupsByVolunteer } from "@/lib/services/signups";
import { getAllShifts } from "@/lib/services/shifts";
import { ShiftCard } from "@/components/shifts/ShiftCard";
import { WeekView } from "@/components/shifts/WeekView";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays } from "lucide-react";

export default function SchedulePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [shifts, setShifts] = useState<Map<string, Shift>>(new Map());

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const [mySignups, allShifts] = await Promise.all([
          getSignupsByVolunteer(user.id),
          getAllShifts(),
        ]);
        setSignups(mySignups);
        const shiftMap = new Map(allShifts.map((s) => [s.id, s]));
        setShifts(shiftMap);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <LoadingSpinner text="Loading schedule..." />;
  if (!user) return null;

  const activeSignups = signups.filter(
    (s) => s.status === "approved" || s.status === "pending"
  );
  const scheduledShifts = activeSignups
    .map((s) => shifts.get(s.shiftId))
    .filter((s): s is Shift => !!s && s.date >= new Date().toISOString().split("T")[0]);

  if (activeSignups.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground">Your upcoming volunteer shifts</p>
        </div>
        <EmptyState
          title="No upcoming shifts"
          description="You haven't signed up for any shifts yet. Browse available shifts to get started."
          icon={<CalendarDays className="h-8 w-8 text-muted-foreground" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Schedule</h1>
        <p className="text-muted-foreground">Your upcoming volunteer shifts</p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="week">Week View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <div className="space-y-3">
            {activeSignups.map((signup) => {
              const shift = shifts.get(signup.shiftId);
              if (!shift) return null;
              return (
                <div key={signup.id} className="relative">
                  <div className="absolute top-3 right-3 z-10">
                    <StatusBadge status={signup.status} />
                  </div>
                  <ShiftCard shift={shift} />
                </div>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="week" className="mt-4">
          <WeekView shifts={scheduledShifts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
