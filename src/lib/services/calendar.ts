// TODO: Replace with Google Calendar API integration
// When integrating Google Calendar:
//   - Use googleapis npm package
//   - Authenticate via OAuth2 or service account
//   - calendar.events.insert() to create events
//   - calendar.events.list() to fetch events
//   - Set up reminders via event.reminders
//
// Also consider:
//   - Google Calendar API for syncing shifts to volunteer calendars
//   - Firebase Cloud Functions to trigger reminder emails
//   - Antigravity (Google) for additional scheduling intelligence

import { Shift } from "@/lib/types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  location?: string;
  description?: string;
}

export function shiftToCalendarEvent(shift: Shift): CalendarEvent {
  return {
    id: shift.id,
    title: shift.title,
    start: `${shift.date}T${shift.startTime}:00`,
    end: `${shift.date}T${shift.endTime}:00`,
    location: shift.location,
    description: shift.description,
  };
}

export async function addShiftToCalendar(
  shift: Shift
): Promise<{ success: boolean; eventId: string }> {
  // TODO: Replace with google.calendar.events.insert()
  await delay(500);
  console.log(`[Mock] Added shift "${shift.title}" to Google Calendar`);
  return { success: true, eventId: `gcal_${shift.id}` };
}

export async function removeShiftFromCalendar(
  eventId: string
): Promise<{ success: boolean }> {
  // TODO: Replace with google.calendar.events.delete()
  await delay(300);
  console.log(`[Mock] Removed event ${eventId} from Google Calendar`);
  return { success: true };
}

export async function syncVolunteerCalendar(
  _volunteerId: string,
  shifts: Shift[]
): Promise<{ synced: number }> {
  // TODO: Replace with batch Google Calendar sync
  await delay(800);
  console.log(`[Mock] Synced ${shifts.length} shifts to volunteer calendar`);
  return { synced: shifts.length };
}
