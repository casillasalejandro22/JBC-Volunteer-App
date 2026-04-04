"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Shift, Signup } from "@/lib/types";
import { getOpenShifts, getAllShifts, createShift, deleteShift } from "@/lib/services/shifts";
import { getSignupsByVolunteer, createSignup } from "@/lib/services/signups";
import { ShiftList } from "@/components/shifts/ShiftList";
import { ShiftFormModal, ShiftFormData } from "@/components/shifts/ShiftFormModal";
import { WeekView } from "@/components/shifts/WeekView";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";

export default function ShiftsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        if (user.role === "volunteer") {
          const [openShifts, mySignups] = await Promise.all([
            getOpenShifts(),
            getSignupsByVolunteer(user.id),
          ]);
          setShifts(openShifts);
          setSignups(mySignups);
        } else {
          const allShifts = await getAllShifts();
          setShifts(allShifts);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleSignUp = async (shiftId: string) => {
    if (!user) return;
    const signup = await createSignup(shiftId, user.id, user.name);
    setSignups((prev) => [...prev, signup]);
  };

  const handleCreateShift = async (data: ShiftFormData) => {
    if (!user) return;
    const newShift = await createShift({
      ...data,
      status: "open",
      createdBy: user.id,
    });
    setShifts((prev) => [...prev, newShift]);
  };

  const handleDeleteShift = async (shiftId: string) => {
    await deleteShift(shiftId);
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
  };

  if (loading) return <LoadingSpinner text="Loading shifts..." />;
  if (!user) return null;

  const signedUpShiftIds = new Set(signups.map((s) => s.shiftId));

  // ── Volunteer View ────────────────────────────────────
  if (user.role === "volunteer") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Available Shifts</h1>
          <p className="text-muted-foreground">
            Browse and sign up for open volunteer shifts
          </p>
        </div>
        <ShiftList
          shifts={shifts}
          showSignUp
          onSignUp={handleSignUp}
          signedUpShiftIds={signedUpShiftIds}
          emptyTitle="No available shifts"
          emptyDescription="All shifts are currently filled. Check back later!"
        />
      </div>
    );
  }

  // ── Staff View ────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shift Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and monitor all shifts
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Shift
        </Button>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="week">Week View</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <ShiftList
            shifts={shifts}
            showManage
            onManage={handleDeleteShift}
            emptyTitle="No shifts created"
            emptyDescription="Click 'Create Shift' to add your first shift."
          />
        </TabsContent>
        <TabsContent value="week" className="mt-4">
          <WeekView shifts={shifts} />
        </TabsContent>
      </Tabs>

      <ShiftFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreateShift}
      />
    </div>
  );
}
