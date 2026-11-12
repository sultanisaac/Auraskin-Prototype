// Calendar synchronization utilities for Google Calendar & Apple/Outlook (.ics)

export interface CalendarEventInfo {
  title: string;
  treatment: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes?: number;
  location?: string;
  notes?: string;
}

const DEFAULT_LOCATION = "AuraSkin Aesthetic Clinic, Grand Indonesia Mall Level 3, Jakarta Pusat";

/**
 * Formats a Date object to iCalendar compact ISO format: YYYYMMDDTHHmmssZ
 */
function toIcsDateString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

/**
 * Parses appointment date and time into start and end Date objects.
 */
function getStartAndEndDates(dateStr: string, timeStr: string, durationMinutes = 60): { start: Date; end: Date } {
  // Assume Jakarta time / local time: dateStr (YYYY-MM-DD), timeStr (HH:mm)
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  const start = new Date(year, month - 1, day, hour || 9, minute || 0, 0);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  return { start, end };
}

/**
 * Generates a direct Google Calendar creation link.
 */
export function getGoogleCalendarUrl(info: CalendarEventInfo): string {
  const { start, end } = getStartAndEndDates(info.date, info.time, info.durationMinutes || 60);

  const title = encodeURIComponent(`AuraSkin Consultation: ${info.treatment}`);
  const details = encodeURIComponent(
    `AuraSkin Medical Aesthetic Clinic Consultation\n\nPatient: ${info.patientName}\nTreatment: ${info.treatment}\nScheduled Time: ${info.time}\n\nNotes: Please arrive 10-15 minutes prior to your consultation.\nContact Clinic: +62 812-7331-5620`
  );
  const location = encodeURIComponent(info.location || DEFAULT_LOCATION);
  const dates = `${toIcsDateString(start)}/${toIcsDateString(end)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Generates and triggers download of a standardized .ics file
 * for Apple Calendar (iPhone / Mac) and Microsoft Outlook.
 */
export function downloadIcsCalendar(info: CalendarEventInfo): void {
  if (typeof window === "undefined") return;

  const { start, end } = getStartAndEndDates(info.date, info.time, info.durationMinutes || 60);
  const now = new Date();

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AuraSkin Clinic//Appointment Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:auraskin-${info.date}-${info.time.replace(":", "")}-${Date.now()}@auraskin.com`,
    `DTSTAMP:${toIcsDateString(now)}`,
    `DTSTART:${toIcsDateString(start)}`,
    `DTEND:${toIcsDateString(end)}`,
    `SUMMARY:AuraSkin: ${info.treatment}`,
    `DESCRIPTION:AuraSkin Medical Aesthetic Consultation for ${info.patientName}. Treatment: ${info.treatment}. Please arrive 10-15 minutes early.`,
    `LOCATION:${info.location || DEFAULT_LOCATION}`,
    "STATUS:CONFIRMED",
    // 24 Hour Alarm Reminder
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:AuraSkin Appointment Tomorrow",
    "END:VALARM",
    // 2 Hour Alarm Reminder
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:AuraSkin Appointment in 2 Hours",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `auraskin-appointment-${info.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

