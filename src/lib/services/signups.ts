// TODO: Replace with Firestore operations
// Target collection: "signups"
// When integrating Firebase, replace these functions with:
//   - collection(db, "signups") queries with where() filters
//   - addDoc / updateDoc
//   - Use a Cloud Function or transaction to update shift.spotsFilled atomically

import { Signup, SignupStatus } from "@/lib/types";
import { mockSignups } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let signups = [...mockSignups];

export async function getSignupsByVolunteer(
  volunteerId: string
): Promise<Signup[]> {
  await delay(300);
  return signups.filter((s) => s.volunteerId === volunteerId);
}

export async function getSignupsByShift(shiftId: string): Promise<Signup[]> {
  await delay(300);
  return signups.filter((s) => s.shiftId === shiftId);
}

export async function getPendingSignups(): Promise<Signup[]> {
  await delay(300);
  return signups.filter((s) => s.status === "pending");
}

export async function getAllSignups(): Promise<Signup[]> {
  await delay(300);
  return [...signups];
}

export async function createSignup(
  shiftId: string,
  volunteerId: string,
  volunteerName: string
): Promise<Signup> {
  await delay(400);
  const newSignup: Signup = {
    id: `su${Date.now()}`,
    shiftId,
    volunteerId,
    volunteerName,
    status: "pending",
    signedUpAt: new Date().toISOString(),
  };
  signups = [...signups, newSignup];
  return newSignup;
}

export async function updateSignupStatus(
  id: string,
  status: SignupStatus,
  reviewerId?: string
): Promise<Signup | null> {
  await delay(300);
  const index = signups.findIndex((s) => s.id === id);
  if (index === -1) return null;
  signups[index] = {
    ...signups[index],
    status,
    reviewedBy: reviewerId,
    reviewedAt: new Date().toISOString(),
  };
  return signups[index];
}
