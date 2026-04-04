// TODO: Replace with Firestore operations
// Target collection: "attendance"
// When integrating Firebase, replace these functions with:
//   - collection(db, "attendance") queries
//   - addDoc / updateDoc
//   - Aggregate queries for total hours

import { Attendance, AttendanceStatus } from "@/lib/types";
import { mockAttendance } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let records = [...mockAttendance];

export async function getAttendanceByVolunteer(
  volunteerId: string
): Promise<Attendance[]> {
  await delay(300);
  return records.filter((r) => r.volunteerId === volunteerId);
}

export async function getCompletedAttendance(
  volunteerId: string
): Promise<Attendance[]> {
  await delay(300);
  return records.filter(
    (r) => r.volunteerId === volunteerId && r.status === "completed"
  );
}

export async function getTotalHours(volunteerId: string): Promise<number> {
  await delay(200);
  return records
    .filter((r) => r.volunteerId === volunteerId && r.status === "completed")
    .reduce((sum, r) => sum + r.hoursLogged, 0);
}

export async function getAllAttendance(): Promise<Attendance[]> {
  await delay(300);
  return [...records];
}

export async function markAttendance(
  id: string,
  status: AttendanceStatus,
  hoursLogged: number,
  staffId: string,
  notes?: string
): Promise<Attendance | null> {
  await delay(300);
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;
  records[index] = {
    ...records[index],
    status,
    hoursLogged,
    notes,
    markedBy: staffId,
    markedAt: new Date().toISOString(),
  };
  return records[index];
}

export async function createAttendanceRecord(
  data: Omit<Attendance, "id" | "markedAt">
): Promise<Attendance> {
  await delay(400);
  const record: Attendance = {
    ...data,
    id: `a${Date.now()}`,
  };
  records = [...records, record];
  return record;
}
