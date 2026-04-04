"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { ShiftList } from "@/components/shifts/ShiftList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Shift, Signup, Attendance } from "@/lib/types";
import { getOpenShifts, getUpcomingShifts } from "@/lib/services/shifts";
import { getSignupsByVolunteer, getPendingSignups } from "@/lib/services/signups";
import { getTotalHours, getAllAttendance } from "@/lib/services/attendance";
import {
  CalendarDays,
  Clock,
  Users,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [allAttendance, setAllAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        if (user.role === "volunteer") {
          const [openShifts, mySignups, hours] = await Promise.all([
            getOpenShifts(),
            getSignupsByVolunteer(user.id),
            getTotalHours(user.id),
          ]);
          setShifts(openShifts.slice(0, 3));
          setSignups(mySignups);
          setTotalHours(hours);
        } else {
          const [upcoming, pending, attendance] = await Promise.all([
            getUpcomingShifts(),
            getPendingSignups(),
            getAllAttendance(),
          ]);
          setShifts(upcoming);
          setPendingCount(pending.length);
          setAllAttendance(attendance);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (!user) return null;

  // ── Volunteer Dashboard ───────────────────────────────
  if (user.role === "volunteer") {
    const upcomingSignups = signups.filter(
      (s) => s.status === "approved" || s.status === "pending"
    );

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground">
            Here&apos;s your volunteer overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Upcoming Shifts"
            value={upcomingSignups.length}
            description="Scheduled or pending"
            icon={<CalendarDays className="h-4 w-4" />}
          />
          <StatCard
            label="Total Hours"
            value={totalHours}
            description="Completed volunteer hours"
            trend="up"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            label="Pending Signups"
            value={signups.filter((s) => s.status === "pending").length}
            description="Awaiting staff approval"
            icon={<CheckSquare className="h-4 w-4" />}
          />
          <StatCard
            label="Available Shifts"
            value={shifts.length}
            description="Open for sign up"
            icon={<Users className="h-4 w-4" />}
          />
        </div>

        {/* Available shifts preview */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Shifts</h2>
          <ShiftList
            shifts={shifts}
            showSignUp
            signedUpShiftIds={
              new Set(signups.map((s) => s.shiftId))
            }
            emptyTitle="No open shifts"
            emptyDescription="Check back later for new volunteer opportunities."
          />
        </div>
      </div>
    );
  }

  // ── Staff Dashboard ───────────────────────────────────
  const openShifts = shifts.filter((s) => s.status === "open");
  const gapShifts = openShifts.filter(
    (s) => s.spotsFilled < s.spotsTotal * 0.5
  );
  const completedHours = allAttendance
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.hoursLogged, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <p className="text-muted-foreground">
          Manage volunteers and shifts at a glance
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Upcoming Shifts"
          value={shifts.length}
          description="Next 30 days"
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <StatCard
          label="Pending Approvals"
          value={pendingCount}
          description="Volunteer signups to review"
          trend={pendingCount > 0 ? "up" : "neutral"}
          icon={<CheckSquare className="h-4 w-4" />}
        />
        <StatCard
          label="Coverage Gaps"
          value={gapShifts.length}
          description="Shifts below 50% capacity"
          trend={gapShifts.length > 0 ? "down" : "neutral"}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          label="Total Hours Logged"
          value={completedHours}
          description="All volunteers combined"
          trend="up"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Coverage gaps */}
      {gapShifts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Coverage Gaps</h2>
          <ShiftList
            shifts={gapShifts}
            showManage
            emptyTitle="Full coverage"
            emptyDescription="All shifts have adequate volunteer coverage."
          />
        </div>
      )}

      {/* Upcoming shifts */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Upcoming Shifts</h2>
        <ShiftList
          shifts={openShifts.slice(0, 6)}
          showManage
          emptyTitle="No upcoming shifts"
          emptyDescription="Create shifts to start scheduling volunteers."
        />
      </div>
    </div>
  );
}
