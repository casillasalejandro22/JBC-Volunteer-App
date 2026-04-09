# CLAUDE.md — June Bug Center Volunteer Scheduling App

> **How to use this file:** Tasks are organized in priority order. Tell Claude Code which task number to work on. Review and adjust any task before running it. Each task is self-contained with clear acceptance criteria.

---

## Project Overview

**App:** Lightweight volunteer scheduling and reminder system for the June Bug Center — an Appalachian arts after-school STEAM program in Virginia.

**Stack:**
- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Firebase (Auth + Firestore)
- APIs: Google Calendar API
- Notifications: Twilio (SMS) or Firebase Cloud Messaging

**Two user roles:**
- **Volunteer** — sign up for shifts, view schedule, track hours
- **Staff** — post shifts, approve volunteers, track attendance

**Current state of codebase:** Firebase Auth is connected (login, logout, session persistence, role-based routing, auth guard). All pages exist and render. "Manage Shifts" nav is fixed. All data services (shifts, signups, attendance, calendar) exist as stubs backed by mock data — Firestore not yet wired. Phone number field missing from sign-up. Tasks 3–20 not yet started.

---

## Task List

---

### TASK 1 — Fix Broken "Manage Shifts" Navigation ✅ DONE

**What:** The "Manage Shifts" button/link in the Staff view currently does nothing. Wire it up to the correct page.

**Where to look:**
- Staff sidebar or nav component
- Staff dashboard page

**Acceptance criteria:**
- Clicking "Manage Shifts" navigates to the staff shift management page
- Active nav state highlights correctly
- No console errors

---

### TASK 2 — Connect Firebase Authentication ⚠️ PARTIAL

**What:** Replace the mock login with real Firebase Auth. Support email/password login for both volunteers and staff. Role (volunteer vs staff) should be stored in Firestore under `users/{uid}`.

**Details:**
- Install and configure Firebase SDK
- Create `lib/firebase.ts` with app init
- Create `lib/auth.ts` with `signIn`, `signOut`, `getCurrentUser` helpers
- On login, read user role from Firestore and redirect to correct dashboard
- Wrap protected routes with an auth guard (redirect to login if not authenticated)
- Add phone number field to the sign-up form (store in Firestore, needed for SMS later)

**Firestore structure:**
```
users/{uid}
  - name: string
  - email: string
  - phone: string
  - role: "volunteer" | "staff"
  - createdAt: timestamp
```

**Acceptance criteria:**
- ✅ Real login and logout works
- ✅ Wrong credentials show an error message
- ✅ Volunteers land on volunteer dashboard, staff on staff dashboard
- ✅ Refreshing the page keeps the user logged in
- ❌ Phone number is collected and saved at sign-up (field missing from sign-up form and `registerUser`)

---

### TASK 3 — Connect Firestore: Shifts Collection

**What:** Replace all mock shift data with real Firestore reads and writes.

**Firestore structure:**
```
shifts/{shiftId}
  - title: string
  - description: string
  - date: timestamp
  - startTime: string
  - endTime: string
  - location: string
  - spotsTotal: number
  - spotsRemaining: number
  - requiredSkills: string[]
  - status: "open" | "full" | "cancelled"
  - createdBy: uid (staff)
  - weatherRisk: boolean (default false)
  - weatherNote: string (optional)
```

**Details:**
- Staff "Manage Shifts" page: fetch shifts from Firestore, create new shifts via form, cancel shifts
- Volunteer "Available Shifts" page: fetch only open shifts
- Replace all `mockShifts` imports with Firestore service calls
- Create `services/shifts.ts` with `getShifts`, `createShift`, `updateShift`, `deleteShift`

**Acceptance criteria:**
- Staff can create a shift and it appears in Firestore
- Volunteers see the new shift on their available shifts page without refreshing
- Cancelled or full shifts don't appear in volunteer available shifts

---

### TASK 4 — Connect Firestore: Signups Collection

**What:** Replace mock signup logic with real Firestore reads and writes.

**Firestore structure:**
```
signups/{signupId}
  - shiftId: string
  - volunteerId: uid
  - volunteerName: string
  - status: "pending" | "approved" | "rejected" | "waitlist"
  - signedUpAt: timestamp
  - approvedAt: timestamp (optional)
```

**Details:**
- Volunteer "Available Shifts": signing up writes a signup doc and decrements `spotsRemaining` on the shift
- If `spotsRemaining === 0`, new signups get `status: "waitlist"` automatically
- Staff "Approvals" page: fetch pending signups, approve or reject
- Volunteer "My Schedule": fetch approved and pending signups for the logged-in volunteer
- Create `services/signups.ts` with `signUpForShift`, `getSignupsForVolunteer`, `getSignupsForShift`, `approveSignup`, `rejectSignup`
- Prevent a volunteer from signing up for overlapping shifts (check times before writing)

**Acceptance criteria:**
- Volunteer can sign up, see "Pending" status, and see "Approved" after staff approves
- Waitlist status shows correctly when a shift is full
- Overlapping shift signup is blocked with a clear error message
- Staff approvals queue updates in real time

---

### TASK 5 — Connect Firestore: Attendance Collection

**What:** Replace mock attendance data with real Firestore reads and writes.

**Firestore structure:**
```
attendance/{attendanceId}
  - shiftId: string
  - volunteerId: uid
  - volunteerName: string
  - status: "completed" | "no_show"
  - hoursLogged: number
  - loggedAt: timestamp
  - loggedBy: uid (staff)
```

**Details:**
- Staff "Attendance" page: for each approved signup on a past shift, staff can mark "Completed" or "No Show" and enter hours
- Volunteer "Hours History": fetch all `completed` attendance records for the logged-in volunteer, sum total hours
- Create `services/attendance.ts` with `logAttendance`, `getAttendanceForVolunteer`, `getAttendanceForShift`

**Acceptance criteria:**
- Staff can mark attendance and it saves to Firestore
- Volunteer hours history shows accurate total hours
- No show records do not count toward hours

---

### TASK 6 — Reliability Score for Volunteers

**What:** Calculate and display a reliability score for each volunteer based on their attendance history. Similar to a driver rating.

**Formula (suggestion):**
```
score = (completed shifts / total approved past shifts) * 100
```
Display as a percentage or star rating (e.g. 4.7 / 5).

**Details:**
- Add `reliabilityScore: number` to the `users/{uid}` Firestore doc, updated each time attendance is logged
- Or calculate it on-the-fly from the attendance collection (simpler for MVP)
- Show score on:
  - Staff "Approvals" page — next to each volunteer name so staff can prioritize
  - Volunteer dashboard — so volunteers can see their own score
- Add a tooltip explaining what the score means

**Acceptance criteria:**
- Score is visible on the staff approvals queue
- Score is visible on the volunteer's own dashboard
- Score updates after attendance is logged
- New volunteers with no history show "No history yet" instead of a 0

---

### TASK 7 — Waitlist System

**What:** When a shift is full, volunteers can join a waitlist. If an approved volunteer cancels, the next person on the waitlist is automatically promoted to "pending" and notified.

**Details:**
- Signing up for a full shift sets `status: "waitlist"` with a `waitlistPosition` field
- Volunteer "My Schedule" shows waitlist position clearly
- When a cancellation happens: find the next waitlist signup for that shift, promote to "pending", send them a notification (stub the notification for now, wire up in Task 9)
- Create a Cloud Function or client-side trigger for promotion logic
- Staff can see the waitlist in the shift detail view

**Acceptance criteria:**
- Full shifts show "Join Waitlist" button instead of "Sign Up"
- Waitlist position is displayed to the volunteer
- Cancellation promotes the next person automatically
- Waitlist is visible to staff on the shift detail

---

### TASK 8 — Weather Risk Indicator on Shifts

**What:** Staff can flag a shift as weather-sensitive. If flagged, display a weather icon (rain/snow/cloud) on the shift card for volunteers to see.

**Details:**
- Add `weatherRisk: boolean` and `weatherNote: string` to the shift Firestore doc (already in schema above)
- Staff shift creation/edit form: add a "Weather Sensitive" toggle and optional note field
- Shift cards: if `weatherRisk === true`, show a weather icon (🌧️ or ❄️) and the note as a tooltip or badge
- Stretch goal: pull live weather from OpenWeatherMap API for the shift's date and location, auto-flag if rain/snow is forecast

**Acceptance criteria:**
- Staff can toggle weather risk when creating or editing a shift
- Weather icon appears on the shift card for flagged shifts
- Hovering/tapping the icon shows the staff note

---

### TASK 9 — Automated SMS Reminders (Twilio or Firebase Cloud Messaging)

**What:** Send automated reminders to volunteers before their approved shifts.

**Reminder schedule (suggested):**
1. 24 hours before shift — "Your shift is tomorrow. Reply CONFIRM to confirm or CANCEL to cancel."
2. 2 hours before shift — "Your shift starts in 2 hours."

**Confirmation/cancellation flow:**
- Volunteer must confirm or they are removed from the shift and the waitlist is triggered (Task 7)
- If they cancel, waitlist promotion fires

**Details:**
- Use Firebase Cloud Functions + Twilio SMS (or Firebase Cloud Messaging for push)
- Store volunteer phone number from Task 2 sign-up
- Create a scheduled Cloud Function that runs hourly, checks for shifts in the next 24h or 2h, sends SMS if not already sent
- Track reminder state in Firestore:
  ```
  signups/{signupId}
    - reminder24Sent: boolean
    - reminder2Sent: boolean
    - confirmed: boolean
  ```
- Add a "Reminder Preferences" placeholder on the volunteer dashboard (wire up in a future task)

**Acceptance criteria:**
- Reminder SMS is sent 24h and 2h before shift
- Volunteer can confirm via reply or a magic link (see Task 10)
- Unconfirmed volunteers are removed and waitlist is triggered
- Staff see confirmation status on the approvals/attendance page

---

### TASK 10 — Magic Link Shift Confirmation

**What:** Instead of (or in addition to) SMS reply parsing, send a one-time magic link in the reminder SMS. Clicking it confirms the volunteer's shift without requiring login.

**Details:**
- Generate a short-lived signed token (Firebase custom token or a UUID stored in Firestore with an expiry)
- Include the link in the reminder SMS: `"Confirm your shift: https://junebug.app/confirm?token=abc123"`
- Create a `/confirm` page in Next.js that reads the token, validates it, marks the signup as confirmed, and shows a success message
- Token expires after the shift start time or after use

**Acceptance criteria:**
- Magic link in SMS works without the volunteer logging in
- Confirming via link updates Firestore signup doc
- Expired or invalid tokens show a clear error
- Double-confirming is handled gracefully (idempotent)

---

### TASK 11 — Staff Reminder Notifications for Pending Approvals

**What:** Staff should be notified (email or SMS) when new volunteers sign up and are waiting for approval.

**Details:**
- When a new signup doc is created with `status: "pending"`, trigger a Firebase Cloud Function
- Send a notification to all staff with a summary: volunteer name, shift name, date
- Include a deep link to the approvals page
- Batch notifications (don't send one per signup — send a digest if multiple come in within 10 minutes)

**Acceptance criteria:**
- Staff receive a notification within a few minutes of a volunteer signing up
- Notification includes enough info to act without opening the app
- Batching prevents notification spam

---

### TASK 12 — Google Calendar Integration

**What:** Allow volunteers to export their approved shifts to Google Calendar.

**Details:**
- Add an "Add to Google Calendar" button on each approved shift in "My Schedule"
- Use the Google Calendar API or a calendar link generator (`calendar.google.com/calendar/r/eventedit?...`) — the link approach is simpler for MVP
- Stretch: use Google Calendar API with OAuth to create the event server-side and keep it in sync if the shift changes or is cancelled
- If shift is cancelled, send a calendar update (stretch)

**Acceptance criteria:**
- Volunteer can tap "Add to Calendar" and the event appears in Google Calendar
- Event includes shift name, date, time, and location
- MVP can use a pre-filled link; full API integration is a stretch goal

---

### TASK 13 — No Overlapping Shifts Enforcement

**What:** Prevent a volunteer from signing up for two shifts that overlap in time.

**Details:**
- Before writing a new signup to Firestore, check all existing approved/pending signups for that volunteer
- Fetch their current shifts, compare time ranges
- If overlap detected, block the signup and show an error: "You already have a shift during this time: [shift name]"
- This check should also exist server-side in a Cloud Function for safety

**Acceptance criteria:**
- Volunteer cannot sign up for overlapping shifts
- Error message clearly names the conflicting shift
- Check happens before any Firestore write

---

### TASK 14 — Volunteer Exchange Program Tab

**What:** Add a new tab to the Volunteer dashboard called "Tuition Exchange" (or "Hour Exchange"). Qualifying families can offset tuition costs through volunteering (1 volunteer hour = 1 hour of tuition credit). Students can also track hours for NHS or ACCE.

**Details:**
- New page: `/volunteer/exchange`
- Show:
  - Goal hours (set by staff or the volunteer at onboarding)
  - Hours completed so far (pulled from attendance)
  - Progress bar toward the goal
  - Deadline (if set)
  - A note explaining the program
- Staff can toggle a volunteer as "Exchange Eligible" and set their hour goal in the user's Firestore doc
- Add fields to `users/{uid}`:
  ```
  - exchangeEligible: boolean
  - exchangeGoalHours: number
  - exchangeDeadline: timestamp
  - exchangePurpose: "tuition" | "NHS" | "ACCE" | "other"
  ```

**Acceptance criteria:**
- Exchange tab appears only for eligible volunteers
- Progress bar accurately reflects completed hours vs goal
- Deadline is displayed with urgency indicator if close

---

### TASK 15 — Role Matching at Sign-Up

**What:** During volunteer account creation, ask volunteers about their skills. When viewing available shifts, surface shifts that match their skills.

**Details:**
- At sign-up (or onboarding step after login), show a checklist of skill tags (e.g. Music, Art, Storytelling, Woodworking, Cooking, Photography, Childcare, Event Setup, etc.) — keep it Appalachian arts relevant
- Store as `skills: string[]` in `users/{uid}`
- Staff can tag shifts with `requiredSkills: string[]` when creating them
- On the volunteer "Available Shifts" page, add a "Best Match" section at the top showing shifts that match their skills
- Use simple string intersection for MVP; no AI needed yet
- Stretch: use Claude API to match a volunteer's free-text bio/skills description to shift tags

**Acceptance criteria:**
- Volunteers select skills during onboarding
- "Best Match" shifts appear at the top of available shifts
- Skill tags are visible on shift cards

---

### TASK 16 — Buddy System (Linked Accounts)

**What:** Volunteers can link their account to friends. When a friend signs up for a shift, linked volunteers get a notification: "Your friend [Name] just signed up for [Shift]. Want to join them?"

**Details:**
- Add `buddies: uid[]` to `users/{uid}`
- Volunteer profile page: search for other volunteers by name/email and send a buddy request
- Buddy requests stored in Firestore: `buddyRequests/{requestId}` with `from`, `to`, `status`
- When a signup is created, Cloud Function checks if the volunteer has buddies, sends them a push notification or SMS
- Notification includes a magic link to sign up for the same shift in one tap (see Task 10 pattern)

**Acceptance criteria:**
- Volunteers can add and accept buddy connections
- Buddy notification fires when a friend signs up
- Notification includes a one-tap sign-up link
- Buddy list is visible on the volunteer profile

---

### TASK 17 — June Bug Avatar + Leaderboard

**What:** Each volunteer gets a June Bug avatar they can customize. The volunteer with the most hours each month wins new clothing items for their avatar. Volunteers can also donate to unlock clothing early.

**Details:**

**Avatar:**
- Simple illustrated June Bug character (SVG or image assets)
- Default outfit; unlockable clothing items (hat, jacket, accessories, etc.)
- Unlocked items stored in `users/{uid}.avatarItems: string[]`
- Avatar displayed on volunteer dashboard and profile

**Leaderboard:**
- Monthly leaderboard ranked by total hours that month
- Reset at the start of each month (archive previous month's winner)
- Top volunteer automatically unlocks a new avatar item
- Show leaderboard on a shared page: `/leaderboard`

**Donate to unlock:**
- "Unlock with Donation" button on locked items opens a Stripe or external donation link (June Bug Center donation page: `https://junebugcenter.org/donate`)
- On successful donation, staff can manually unlock items (or automate via Stripe webhook)
- All donation revenue goes to the June Bug Center

**Acceptance criteria:**
- Avatar displays on volunteer dashboard
- Leaderboard shows top volunteers by hours this month
- Monthly winner gets a new item unlocked automatically
- Donation unlock flow links to the donation page
- Unlocked items are saved and persist across sessions

---

### TASK 18 — Partial Shift Sign-Ups

**What:** Allow volunteers to sign up for only part of a shift (e.g., first 2 hours of a 4-hour shift).

**Details:**
- Shift has `startTime` and `endTime`
- On sign-up, volunteer can optionally set their own `availableFrom` and `availableUntil` within the shift window
- Store in signup doc: `partialStart: string`, `partialEnd: string`, `isPartial: boolean`
- Staff can see partial availability on the approvals page
- Hours logged at attendance reflects actual time worked (staff enters manually)
- Shift coverage view shows which time slots still need volunteers

**Acceptance criteria:**
- Volunteer can specify partial availability when signing up
- Staff sees partial vs full coverage on the shift detail
- Hours logged match partial time worked

---

### TASK 19 — Signup Deadline per Shift

**What:** Staff can set a deadline for volunteers to sign up for a shift. After the deadline, sign-ups are closed.

**Details:**
- Add `signupDeadline: timestamp` to shift Firestore doc (optional field)
- Staff shift creation form: optional "Sign-up Deadline" date/time picker
- Volunteer available shifts: show deadline on shift card; disable sign-up button after deadline
- Cloud Function or client-side check: if current time > deadline, shift is not listed in available shifts (or shown as "Closed")

**Acceptance criteria:**
- Deadline shows on shift card
- Sign-up button is disabled after deadline
- Shifts past deadline don't appear in available shifts list

---

### TASK 20 — README Update

**What:** Update the project README to reflect current state of the codebase after all above tasks.

**Contents:**
- Project overview and purpose
- Tech stack
- How to run locally
- Environment variables needed (Firebase, Twilio, Google Calendar API keys)
- Architecture decisions and folder structure explanation
- Feature list: what's complete, what's in progress, what's planned
- Firebase integration points
- Google Calendar integration points
- Firestore data model (all collections and fields)
- How to deploy (Vercel + Firebase)
- Contributing guide for hackathon teammates

**Acceptance criteria:**
- New developer can clone the repo and run it locally by following the README
- All environment variables are documented (not the values, just the names)
- Firestore schema is fully documented

---

## Notes for Claude Code

- Always check if a service file already exists before creating a new one
- Keep mock data intact and behind a `USE_MOCK_DATA` flag so the app still runs without Firebase credentials
- Add `// TODO: [Firebase]` or `// TODO: [Google Calendar]` comments wherever stubs exist
- Match shift examples to what the June Bug Center actually does: music lessons, art workshops, storytelling events, Appalachian craft sessions, after-school STEAM activities, community performances
- Keep UI simple, warm, and accessible — this is a nonprofit tool used by community volunteers, not a tech-savvy enterprise team
- Mobile-friendly layouts matter — many volunteers will use this on their phones