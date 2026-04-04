"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Attendance } from "@/lib/types";
import { getAllAttendance, markAttendance } from "@/lib/services/attendance";
import { AttendanceTracker } from "@/components/attendance/AttendanceTracker";
import { StatCard } from "@/components/dashboard/StatCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, AlertTriangle } from "lucide-react";

export default function AttendancePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<Attendance[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const all = await getAllAttendance();
        setRecords(all);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleMarkComplete = async (id: string, hours: number) => {
    if (!user) return;
    const updated = await markAttendance(id, "completed", hours, user.id);
    if (updated) {
      setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
  };

  const handleMarkNoShow = async (id: string) => {
    if (!user) return;
    const updated = await markAttendance(id, "no_show", 0, user.id);
    if (updated) {
      setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
  };

  if (loading) return <LoadingSpinner text="Loading attendance..." />;

  const scheduled = records.filter((r) => r.status === "scheduled");
  const completed = records.filter((r) => r.status === "completed");
  const noShows = records.filter((r) => r.status === "no_show");
  const totalHours = completed.reduce((sum, r) => sum + r.hoursLogged, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance Tracking</h1>
        <p className="text-muted-foreground">
          Track volunteer attendance and log completed hours
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard
          label="Scheduled"
          value={scheduled.length}
          description="Upcoming check-ins"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Completed"
          value={completed.length}
          description="Shifts attended"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          label="No Shows"
          value={noShows.length}
          description="Missed shifts"
          trend={noShows.length > 0 ? "down" : "neutral"}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          label="Total Hours"
          value={totalHours}
          description="All volunteers"
          trend="up"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Attendance records */}
      <Tabs defaultValue="scheduled">
        <TabsList>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduled.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="all">All Records</TabsTrigger>
        </TabsList>
        <TabsContent value="scheduled" className="mt-4">
          <AttendanceTracker
            records={scheduled}
            onMarkComplete={handleMarkComplete}
            onMarkNoShow={handleMarkNoShow}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <AttendanceTracker
            records={completed}
            onMarkComplete={handleMarkComplete}
            onMarkNoShow={handleMarkNoShow}
          />
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <AttendanceTracker
            records={records}
            onMarkComplete={handleMarkComplete}
            onMarkNoShow={handleMarkNoShow}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
