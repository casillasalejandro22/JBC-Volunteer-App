"use client";

import { Attendance } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users } from "lucide-react";

interface AttendanceTrackerProps {
  records: Attendance[];
  onMarkComplete: (id: string, hours: number) => void;
  onMarkNoShow: (id: string) => void;
}

export function AttendanceTracker({
  records,
  onMarkComplete,
  onMarkNoShow,
}: AttendanceTrackerProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No attendance records"
        description="Attendance records will appear here once volunteers are scheduled for shifts."
        icon={<Users className="h-8 w-8 text-muted-foreground" />}
      />
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Volunteer</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">
                {record.volunteerName}
              </TableCell>
              <TableCell>{record.shiftTitle}</TableCell>
              <TableCell>
                {new Date(record.date + "T00:00:00").toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" }
                )}
              </TableCell>
              <TableCell>
                {record.hoursLogged > 0 ? `${record.hoursLogged}h` : "-"}
              </TableCell>
              <TableCell>
                <StatusBadge status={record.status} />
              </TableCell>
              <TableCell className="text-right">
                {record.status === "scheduled" && (
                  <div className="flex gap-1 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkComplete(record.id, 4)}
                    >
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onMarkNoShow(record.id)}
                    >
                      No Show
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
