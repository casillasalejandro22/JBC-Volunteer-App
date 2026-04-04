// TODO: Replace with Firestore operations
// Target collection: "shifts"
// When integrating Firebase, replace these functions with:
//   - collection(db, "shifts") queries
//   - addDoc / updateDoc / deleteDoc
//   - onSnapshot for real-time listeners

import { Shift } from "@/lib/types";
import { mockShifts } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let shifts = [...mockShifts];

export async function getAllShifts(): Promise<Shift[]> {
  await delay(300);
  return [...shifts];
}

export async function getShiftById(id: string): Promise<Shift | null> {
  await delay(200);
  return shifts.find((s) => s.id === id) ?? null;
}

export async function getOpenShifts(): Promise<Shift[]> {
  await delay(300);
  return shifts.filter((s) => s.status === "open");
}

export async function getUpcomingShifts(): Promise<Shift[]> {
  await delay(300);
  const today = new Date().toISOString().split("T")[0];
  return shifts.filter((s) => s.date >= today && s.status !== "cancelled");
}

export async function getCompletedShifts(): Promise<Shift[]> {
  await delay(300);
  return shifts.filter((s) => s.status === "completed");
}

export async function createShift(
  data: Omit<Shift, "id" | "createdAt" | "spotsFilled">
): Promise<Shift> {
  await delay(400);
  const newShift: Shift = {
    ...data,
    id: `sh${Date.now()}`,
    spotsFilled: 0,
    createdAt: new Date().toISOString(),
  };
  shifts = [...shifts, newShift];
  return newShift;
}

export async function updateShift(
  id: string,
  data: Partial<Shift>
): Promise<Shift | null> {
  await delay(300);
  const index = shifts.findIndex((s) => s.id === id);
  if (index === -1) return null;
  shifts[index] = { ...shifts[index], ...data };
  return shifts[index];
}

export async function deleteShift(id: string): Promise<boolean> {
  await delay(300);
  const before = shifts.length;
  shifts = shifts.filter((s) => s.id !== id);
  return shifts.length < before;
}
