"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Attendance } from "@/lib/types";
import { getCompletedAttendance, getTotalHours } from "@/lib/services/attendance";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, CalendarDays, Award } from "lucide-react";

export default function HoursPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<Attendance[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const [completed, hours] = await Promise.all([
          getCompletedAttendance(user.id),
          getTotalHours(user.id),
        ]);
        setRecords(completed);
        setTotalHours(hours);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <LoadingSpinner text="Loading hours..." />;
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hours History</h1>
        <p className="text-muted-foreground">
          Your completed volunteer hours and shift history
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Hours"
          value={totalHours}
          description="All-time completed hours"
          trend="up"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          label="Shifts Completed"
          value={records.length}
          description="Total shifts attended"
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <StatCard
          label="Average per Shift"
          value={
            records.length > 0
              ? (totalHours / records.length).toFixed(1)
              : "0"
          }
          description="Hours per shift"
          icon={<Award className="h-4 w-4" />}
        />
      </div>

      {/* History table */}
      {records.length === 0 ? (
        <EmptyState
          title="No completed hours yet"
          description="Once you complete your first shift, your hours will appear here."
          icon={<Clock className="h-8 w-8 text-muted-foreground" />}
        />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shift</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.shiftTitle}
                  </TableCell>
                  <TableCell>
                    {new Date(record.date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </TableCell>
                  <TableCell>{record.hoursLogged}h</TableCell>
                  <TableCell>
                    <StatusBadge status={record.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
