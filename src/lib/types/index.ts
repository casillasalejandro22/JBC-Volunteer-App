// Shared type definitions for JBC Volunteer App
// These mirror the planned Firestore document schemas

export type UserRole = "volunteer" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string; // ISO date string
}

export type ShiftStatus = "open" | "filled" | "cancelled" | "completed";

export interface Shift {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  spotsTotal: number;
  spotsFilled: number;
  status: ShiftStatus;
  createdBy: string; // staff user ID
  createdAt: string;
}

export type SignupStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Signup {
  id: string;
  shiftId: string;
  volunteerId: string;
  volunteerName: string;
  status: SignupStatus;
  signedUpAt: string;
  reviewedBy?: string; // staff user ID
  reviewedAt?: string;
}

export type AttendanceStatus = "scheduled" | "completed" | "no_show" | "excused";

export interface Attendance {
  id: string;
  shiftId: string;
  volunteerId: string;
  volunteerName: string;
  shiftTitle: string;
  date: string;
  hoursLogged: number;
  status: AttendanceStatus;
  notes?: string;
  markedBy?: string; // staff user ID
  markedAt?: string;
}

export interface Reminder {
  id: string;
  shiftId: string;
  volunteerId: string;
  type: "email" | "calendar" | "push";
  scheduledFor: string;
  sent: boolean;
}

// Dashboard stat card data
export interface StatCardData {
  label: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

// Navigation item for sidebar
export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
}
