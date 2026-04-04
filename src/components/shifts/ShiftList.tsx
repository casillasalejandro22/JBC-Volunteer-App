"use client";

import { Shift } from "@/lib/types";
import { ShiftCard } from "./ShiftCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarDays } from "lucide-react";

interface ShiftListProps {
  shifts: Shift[];
  onSignUp?: (shiftId: string) => void;
  onManage?: (shiftId: string) => void;
  showSignUp?: boolean;
  showManage?: boolean;
  signedUpShiftIds?: Set<string>;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ShiftList({
  shifts,
  onSignUp,
  onManage,
  showSignUp,
  showManage,
  signedUpShiftIds,
  emptyTitle = "No shifts found",
  emptyDescription = "There are no shifts to display right now.",
}: ShiftListProps) {
  if (shifts.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<CalendarDays className="h-8 w-8 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {shifts.map((shift) => (
        <ShiftCard
          key={shift.id}
          shift={shift}
          onSignUp={onSignUp}
          onManage={onManage}
          showSignUp={showSignUp}
          showManage={showManage}
          isSignedUp={signedUpShiftIds?.has(shift.id)}
        />
      ))}
    </div>
  );
}
