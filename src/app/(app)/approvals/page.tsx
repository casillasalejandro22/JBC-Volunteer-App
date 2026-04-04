"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Signup, Shift } from "@/lib/types";
import { getPendingSignups, updateSignupStatus, getAllSignups } from "@/lib/services/signups";
import { getAllShifts } from "@/lib/services/shifts";
import { ApprovalQueue } from "@/components/approvals/ApprovalQueue";
import { StatCard } from "@/components/dashboard/StatCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Clock, XCircle } from "lucide-react";

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingSignups, setPendingSignups] = useState<Signup[]>([]);
  const [allSignups, setAllSignups] = useState<Signup[]>([]);
  const [shiftsMap, setShiftsMap] = useState<Map<string, Shift>>(new Map());

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pending, all, shifts] = await Promise.all([
          getPendingSignups(),
          getAllSignups(),
          getAllShifts(),
        ]);
        setPendingSignups(pending);
        setAllSignups(all);
        setShiftsMap(new Map(shifts.map((s) => [s.id, s])));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleApprove = async (signupId: string) => {
    await updateSignupStatus(signupId, "approved", user?.id);
    setPendingSignups((prev) => prev.filter((s) => s.id !== signupId));
    setAllSignups((prev) =>
      prev.map((s) =>
        s.id === signupId ? { ...s, status: "approved" as const } : s
      )
    );
  };

  const handleReject = async (signupId: string) => {
    await updateSignupStatus(signupId, "rejected", user?.id);
    setPendingSignups((prev) => prev.filter((s) => s.id !== signupId));
    setAllSignups((prev) =>
      prev.map((s) =>
        s.id === signupId ? { ...s, status: "rejected" as const } : s
      )
    );
  };

  if (loading) return <LoadingSpinner text="Loading approvals..." />;

  const approvedCount = allSignups.filter((s) => s.status === "approved").length;
  const rejectedCount = allSignups.filter((s) => s.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Approvals</h1>
        <p className="text-muted-foreground">
          Review and manage volunteer shift signups
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending"
          value={pendingSignups.length}
          description="Awaiting review"
          trend={pendingSignups.length > 0 ? "up" : "neutral"}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          label="Approved"
          value={approvedCount}
          description="Total approved signups"
          icon={<CheckSquare className="h-4 w-4" />}
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          description="Total rejected signups"
          icon={<XCircle className="h-4 w-4" />}
        />
      </div>

      {/* Queue */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingSignups.length})
          </TabsTrigger>
          <TabsTrigger value="all">All Signups</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          <ApprovalQueue
            signups={pendingSignups}
            shifts={shiftsMap}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <ApprovalQueue
            signups={allSignups.filter((s) => s.status !== "cancelled")}
            shifts={shiftsMap}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
