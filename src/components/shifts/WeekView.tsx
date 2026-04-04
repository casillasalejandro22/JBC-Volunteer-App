"use client";

import { Shift } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  shifts: Shift[];
  startDate?: Date;
  onShiftClick?: (shift: Shift) => void;
}

function getWeekDates(start: Date): Date[] {
  const dates: Date[] = [];
  const day = start.getDay();
  const monday = new Date(start);
  monday.setDate(start.getDate() - ((day + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function WeekView({ shifts, startDate, onShiftClick }: WeekViewProps) {
  const weekDates = getWeekDates(startDate ?? new Date());
  const today = formatDateKey(new Date());

  const shiftsByDate = new Map<string, Shift[]>();
  for (const shift of shifts) {
    const existing = shiftsByDate.get(shift.date) ?? [];
    existing.push(shift);
    shiftsByDate.set(shift.date, existing);
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden min-w-[700px]">
        {weekDates.map((date) => {
          const key = formatDateKey(date);
          const isToday = key === today;
          const dayShifts = shiftsByDate.get(key) ?? [];

          return (
            <div
              key={key}
              className={cn(
                "bg-card p-3 min-h-[140px]",
                isToday && "bg-primary/5"
              )}
            >
              <div className="text-center mb-2">
                <p className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isToday &&
                      "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center mx-auto"
                  )}
                >
                  {date.getDate()}
                </p>
              </div>
              <div className="space-y-1">
                {dayShifts.map((shift) => (
                  <button
                    key={shift.id}
                    onClick={() => onShiftClick?.(shift)}
                    className="w-full text-left rounded px-1.5 py-1 bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <p className="text-xs font-medium truncate">
                      {shift.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {shift.startTime} - {shift.endTime}
                    </p>
                  </button>
                ))}
                {dayShifts.length === 0 && (
                  <p className="text-[10px] text-muted-foreground text-center pt-2">
                    No shifts
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
