"use client";

import { Shift } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MapPin, Clock, Users } from "lucide-react";

interface ShiftCardProps {
  shift: Shift;
  onSignUp?: (shiftId: string) => void;
  onManage?: (shiftId: string) => void;
  showSignUp?: boolean;
  showManage?: boolean;
  isSignedUp?: boolean;
}

export function ShiftCard({
  shift,
  onSignUp,
  onManage,
  showSignUp,
  showManage,
  isSignedUp,
}: ShiftCardProps) {
  const spotsRemaining = shift.spotsTotal - shift.spotsFilled;
  const dateFormatted = new Date(shift.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric" }
  );

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {shift.title}
          </CardTitle>
          <StatusBadge status={shift.status} />
        </div>
        <p className="text-sm text-muted-foreground">{dateFormatted}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {shift.description}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {shift.startTime} - {shift.endTime}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {shift.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {spotsRemaining} of {shift.spotsTotal} spots left
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          {showSignUp && !isSignedUp && spotsRemaining > 0 && (
            <Button
              size="sm"
              onClick={() => onSignUp?.(shift.id)}
            >
              Sign Up
            </Button>
          )}
          {showSignUp && isSignedUp && (
            <Button size="sm" variant="secondary" disabled>
              Signed Up
            </Button>
          )}
          {showManage && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onManage?.(shift.id)}
            >
              Manage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
