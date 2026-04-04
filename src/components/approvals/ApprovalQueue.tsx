"use client";

import { Signup, Shift } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { CheckSquare, Clock } from "lucide-react";

interface ApprovalQueueProps {
  signups: Signup[];
  shifts: Map<string, Shift>;
  onApprove: (signupId: string) => void;
  onReject: (signupId: string) => void;
}

export function ApprovalQueue({
  signups,
  shifts,
  onApprove,
  onReject,
}: ApprovalQueueProps) {
  if (signups.length === 0) {
    return (
      <EmptyState
        title="No pending approvals"
        description="All volunteer signups have been reviewed."
        icon={<CheckSquare className="h-8 w-8 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="space-y-3">
      {signups.map((signup) => {
        const shift = shifts.get(signup.shiftId);
        return (
          <Card key={signup.id}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">
                      {signup.volunteerName}
                    </p>
                    <StatusBadge status={signup.status} />
                  </div>
                  {shift && (
                    <p className="text-sm text-muted-foreground">
                      {shift.title} &middot;{" "}
                      {new Date(shift.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}{" "}
                      &middot; {shift.startTime} - {shift.endTime}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Signed up{" "}
                    {new Date(signup.signedUpAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => onApprove(signup.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReject(signup.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
