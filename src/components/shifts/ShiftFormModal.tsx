"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shift } from "@/lib/types";

interface ShiftFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ShiftFormData) => void;
  initialData?: Partial<Shift>;
  mode?: "create" | "edit";
}

export interface ShiftFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  spotsTotal: number;
}

export function ShiftFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = "create",
}: ShiftFormModalProps) {
  const [form, setForm] = useState<ShiftFormData>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    date: initialData?.date ?? "",
    startTime: initialData?.startTime ?? "",
    endTime: initialData?.endTime ?? "",
    location: initialData?.location ?? "",
    spotsTotal: initialData?.spotsTotal ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  const update = (field: keyof ShiftFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Shift" : "Edit Shift"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Shift Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Morning Garden Cleanup"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="What will volunteers do during this shift?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="e.g. Main Building"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spots">Spots</Label>
              <Input
                id="spots"
                type="number"
                min={1}
                value={form.spotsTotal}
                onChange={(e) => update("spotsTotal", parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Shift" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
