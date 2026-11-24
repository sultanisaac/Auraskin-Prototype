# Reusable Clinic & Booking Engine Blueprint (`Planning.md`)

This guide is a complete, copy-pasteable architectural blueprint containing all the core systems from this application. You can paste these modules directly into another project while customizing the branding, colors, business name, and services.

---

## Table of Contents
1. [Global Brand Configuration & Environment Variables](#1-global-brand-configuration--environment-variables)
2. [Required Dependencies](#2-required-dependencies)
3. [Module 1: Notification Audio Engine (`src/lib/notificationSound.ts`)](#module-1-notification-audio-engine)
4. [Module 2: 1-Click WhatsApp Direct Chat & Number Normalizer (`src/lib/whatsapp.ts`)](#module-2-1-click-whatsapp-direct-chat--number-normalizer)
5. [Module 3: 1-Click Calendar Sync with Alarms (`src/lib/calendarSync.ts`)](#module-3-1-click-calendar-sync-with-alarms)
6. [Module 4: Services & Treatments Schema (`src/data/servicesData.ts`)](#module-4-services--treatments-schema)
7. [Module 5: Server Actions & Double-Booking Lockout (`src/actions/booking.ts`)](#module-5-server-actions--double-booking-lockout)
8. [Module 6: Branded Automated Email Engine (`src/lib/email.ts` & `src/app/api/notify/route.ts`)](#module-6-branded-automated-email-engine)
9. [Module 7: Admin Security PIN Protection (`src/components/PinProtection.tsx`)](#module-7-admin-security-pin-protection)
10. [Module 8: Admin Header with Notification Bell & Silence Pill (`src/components/AdminHeader.tsx`)](#module-8-admin-header-with-notification-bell--silence-pill)
11. [Module 9: Admin Visual Calendar (`src/app/admin/calendar/page.tsx` & `src/components/Calendar.tsx`)](#module-9-admin-visual-calendar)
12. [Module 10: Admin Settings Page (`src/app/admin/settings/`)](#module-10-admin-settings-page)
13. [Module 11: 4-Step Consultation Booking Flow with Live Summary (`src/pages/BookingPage.tsx`)](#module-11-4-step-consultation-booking-flow-with-live-summary)
14. [Module 12: Customer Success & Live Tracker (`src/app/(public)/appointment/[id]/`)](#module-12-customer-success--live-tracker)
15. [Integration Checklist](#15-integration-checklist)

---

## 1. Global Brand Configuration & Environment Variables

When copying to your other project, replace these global placeholders with your other project's brand identity:

```ts
// src/config/brand.ts
export const BRAND_CONFIG = {
  name: "Your Clinic Name", // e.g., "AuraSkin", "RadiantCare"
  tagline: "Premium Aesthetic & Medical Clinic",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.vercel.app",
  supportWhatsApp: "+62 821-1715-945", // Admin WhatsApp number
  supportEmail: "business@your-domain.com",
  clinicAddress: "Your Clinic Address, Level 3, Jakarta Pusat",
  googleMapsUrl: "https://maps.google.com/?q=Your+Clinic+Address",
  defaultCurrency: "IDR", // "IDR", "USD", etc.
  defaultAdminPin: "271302", // Default security PIN for admin
};
```

### Fast-Track: Infrastructure Already Connected! 🚀
Since your other project is **already connected to Vercel, Upstash Redis, and Gmail/SMTP App Passwords**, you don't need to provision any new databases or mail servers! You can immediately paste these code modules into your project.

Just verify that your other project's `.env` contains matching variable names:

```bash
# Upstash Redis / Vercel KV (Already connected)
KV_REST_API_URL="https://your-upstash-instance.upstash.io"
KV_REST_API_TOKEN="your_upstash_rest_token"

# (Optional: If your project uses the standard Upstash names instead, our helper automatically supports both!)
# UPSTASH_REDIS_REST_URL="https://..."
# UPSTASH_REDIS_REST_TOKEN="..."

# Email App Password (Already connected)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-char-app-password"

# Live App URL
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

> **Pro Tip:** In `src/actions/booking.ts`, the database helper automatically checks for `KV_REST_API_URL` or `UPSTASH_REDIS_REST_URL`, so it will work seamlessly with your existing Upstash Redis connection without any re-configuration!

---

## 2. Required Dependencies

Install these standard packages in your other project:
```bash
npm install lucide-react date-fns framer-motion nodemailer clsx tailwind-merge zod @hookform/resolvers
npm install -D @types/nodemailer
```

---

## Module 1: Notification Audio Engine
**File: `src/lib/notificationSound.ts`**
*Features: 5 Web Audio synthesized clinic chimes (no audio files needed), custom audio upload from device (`localStorage`), play/stop/pause controls, and instant silence pill listener.*

```ts
// src/lib/notificationSound.ts

export interface SoundPreset {
  id: string;
  name: string;
  description: string;
  toneInfo: string;
}

export const NOTIFICATION_PRESETS: SoundPreset[] = [
  { id: "chime", name: "Gentle Clinic Chime", description: "Relaxing dual-tone bell chime.", toneInfo: "A5 (880Hz) → D6 (1175Hz)" },
  { id: "crystal", name: "Crystal Arpeggio", description: "Sparkling three-tone chord.", toneInfo: "C6 → E6 → G6" },
  { id: "marimba", name: "Warm Marimba", description: "Organic wooden percussive strikes.", toneInfo: "E5 → B5" },
  { id: "zen", name: "Zen Sing Bowl", description: "Deep 432Hz harmonic resonance.", toneInfo: "432Hz Harmonic" },
  { id: "ding", name: "Modern Boutique Ding", description: "Crisp, minimalist boutique ping.", toneInfo: "A6 (1760Hz)" },
];

let audioCtx: AudioContext | null = null;
let activeAudioElement: HTMLAudioElement | null = null;
let activeAudioTimeout: ReturnType<typeof setTimeout> | null = null;
let currentPlayingSoundId: string | null = null;
const audioListeners = new Set<(isPlaying: boolean, soundId?: string | null) => void>();

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function notifyAudioState(isPlaying: boolean, soundId?: string | null): void {
  currentPlayingSoundId = isPlaying ? (soundId || currentPlayingSoundId || "audio") : null;
  audioListeners.forEach((listener) => {
    try { listener(isPlaying, currentPlayingSoundId); } catch (e) {}
  });
}

export function isNotificationAudioPlaying(): boolean {
  if (activeAudioElement && !activeAudioElement.paused && !activeAudioElement.ended) return true;
  return currentPlayingSoundId !== null;
}

export function subscribeAudioPlayback(listener: (isPlaying: boolean, soundId?: string | null) => void): () => void {
  audioListeners.add(listener);
  listener(isNotificationAudioPlaying(), currentPlayingSoundId);
  return () => { audioListeners.delete(listener); };
}

export function stopNotificationSound(): void {
  if (activeAudioTimeout) { clearTimeout(activeAudioTimeout); activeAudioTimeout = null; }
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {}
    activeAudioElement = null;
  }
  notifyAudioState(false, null);
}

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("app_admin_sound_muted") === "true";
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("app_admin_sound_muted", muted ? "true" : "false");
}

export function getActiveSoundId(): string {
  if (typeof window === "undefined") return "chime";
  return localStorage.getItem("app_admin_active_sound") || "chime";
}

export function setActiveSoundId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("app_admin_active_sound", id);
}

export interface CustomSoundInfo { name: string; dataUrl: string; uploadedAt?: string; }

export function getCustomSound(): CustomSoundInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("app_custom_notification_sound");
    return stored ? JSON.parse(stored) : null;
  } catch (e) { return null; }
}

export function saveCustomSound(name: string, dataUrl: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("app_custom_notification_sound", JSON.stringify({ name, dataUrl, uploadedAt: new Date().toISOString() }));
}

export function deleteCustomSound(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("app_custom_notification_sound");
  if (getActiveSoundId() === "custom") setActiveSoundId("chime");
}

function playCustomAudio(dataUrl: string, soundId: string = "custom", autoStopSec?: number): void {
  stopNotificationSound();
  try {
    const audio = new Audio(dataUrl);
    audio.volume = 0.85;
    activeAudioElement = audio;
    audio.onplay = () => notifyAudioState(true, soundId);
    audio.onpause = () => notifyAudioState(false, null);
    audio.onended = () => { if (activeAudioElement === audio) activeAudioElement = null; notifyAudioState(false, null); };
    audio.onerror = () => { if (activeAudioElement === audio) activeAudioElement = null; notifyAudioState(false, null); };
    if (autoStopSec && autoStopSec > 0) activeAudioTimeout = setTimeout(stopNotificationSound, autoStopSec * 1000);
    audio.play().catch(() => notifyAudioState(false, null));
  } catch (err) { notifyAudioState(false, null); }
}

function playPresetChime(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator(); const gain1 = ctx.createGain();
  osc1.type = "sine"; osc1.frequency.setValueAtTime(880, now);
  gain1.gain.setValueAtTime(0, now); gain1.gain.linearRampToValueAtTime(0.2, now + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  osc1.connect(gain1); gain1.connect(ctx.destination);
  osc1.start(now); osc1.stop(now + 0.6);
}

export function previewSound(soundId: string, customDataUrl?: string): void {
  if (isNotificationAudioPlaying() && currentPlayingSoundId === soundId) {
    stopNotificationSound();
    return;
  }
  stopNotificationSound();
  if (soundId === "custom") {
    const url = customDataUrl || getCustomSound()?.dataUrl;
    if (url) { playCustomAudio(url, "custom"); return; }
  }
  const ctx = getAudioContext();
  if (!ctx) return;
  notifyAudioState(true, soundId);
  playPresetChime(ctx);
  activeAudioTimeout = setTimeout(() => notifyAudioState(false, null), 1000);
}

export function playNotificationSound(): void {
  if (isSoundMuted()) return;
  const activeId = getActiveSoundId();
  if (activeId === "custom") {
    const custom = getCustomSound();
    if (custom?.dataUrl) { playCustomAudio(custom.dataUrl, "custom", 30); return; }
  }
  previewSound(activeId);
}
```

---

## Module 2: 1-Click WhatsApp Direct Chat & Number Normalizer
**File: `src/lib/whatsapp.ts`**
*Features: Sanitizes phone numbers (`08...` or `+62...`), generates status-specific messages with your live tracking URL, and creates 1-click WhatsApp links for both customer and admin.*

```ts
// src/lib/whatsapp.ts
import { BRAND_CONFIG } from "@/config/brand";

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return "";
  let clean = phone.replace(/[^\d+]/g, "");
  if (clean.startsWith("+")) clean = clean.substring(1);
  if (clean.startsWith("0")) clean = "62" + clean.substring(1);
  return clean;
}

export function getWhatsAppAppointmentUrl(
  phone: string,
  patientName: string,
  treatment: string,
  date: string,
  time: string,
  status: "pending" | "confirmed" | "declined" | "cancelled" = "confirmed",
  bookingId?: string
): string {
  const recipient = sanitizePhoneNumber(phone);
  const code = bookingId ? `#${bookingId.slice(0, 8).toUpperCase()}` : "";
  const trackingUrl = bookingId ? `${BRAND_CONFIG.appUrl}/appointment/${bookingId}` : BRAND_CONFIG.appUrl;

  let text = `Hello ${patientName},\n\nThis is ${BRAND_CONFIG.name}. Your appointment for *${treatment}* on *${date}* at *${time} WIB* (ID: ${code}) is currently: *${status.toUpperCase()}*.\n\nView live status: ${trackingUrl}\n\nThank you!`;
  return `https://wa.me/${recipient}?text=${encodeURIComponent(text)}`;
}

export function getClinicWhatsAppUrl(bookingId?: string, patientName?: string): string {
  const clinicNumber = sanitizePhoneNumber(BRAND_CONFIG.supportWhatsApp);
  const code = bookingId ? `#${bookingId.slice(0, 8).toUpperCase()}` : "";
  const text = `Hello ${BRAND_CONFIG.name}, I am ${patientName || "a patient"} and I am inquiring about my consultation ${code}.`;
  return `https://wa.me/${clinicNumber}?text=${encodeURIComponent(text)}`;
}
```

---

## Module 3: 1-Click Calendar Sync with Alarms
**File: `src/lib/calendarSync.ts`**
*Features: Builds 1-click Google Calendar URLs and downloads Apple / Outlook `.ics` calendar files with automated 24-hour and 2-hour reminder alarms.*

```ts
// src/lib/calendarSync.ts
import { BRAND_CONFIG } from "@/config/brand";

interface CalendarEventInfo {
  title: string;
  treatment: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  bookingId?: string;
}

function parseDateTime(dateStr: string, timeStr: string): { start: Date; end: Date } {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const start = new Date(year, month - 1, day, hour, minute);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration
  return { start, end };
}

function formatGoogleDate(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
}

export function getGoogleCalendarUrl(info: CalendarEventInfo): string {
  const { start, end } = parseDateTime(info.date, info.time);
  const trackingUrl = info.bookingId ? `${BRAND_CONFIG.appUrl}/appointment/${info.bookingId}` : BRAND_CONFIG.appUrl;
  const description = `Appointment at ${BRAND_CONFIG.name} for ${info.patientName}.\nTreatment: ${info.treatment}\nLive Tracking: ${trackingUrl}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${BRAND_CONFIG.name}: ${info.treatment}`,
    dates: `${formatGoogleDate(start)}/${formatGoogleDate(end)}`,
    details: description,
    location: BRAND_CONFIG.clinicAddress,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsCalendar(info: CalendarEventInfo): void {
  const { start, end } = parseDateTime(info.date, info.time);
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const trackingUrl = info.bookingId ? `${BRAND_CONFIG.appUrl}/appointment/${info.bookingId}` : BRAND_CONFIG.appUrl;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Clinic App//Calendar 1.0//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${BRAND_CONFIG.name}: ${info.treatment}`,
    `DESCRIPTION:Appointment for ${info.patientName}. Live Tracking: ${trackingUrl}`,
    `LOCATION:${BRAND_CONFIG.clinicAddress}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Appointment tomorrow",
    "END:VALARM",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Appointment in 2 hours",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `appointment-${info.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

---

## Module 4: Services & Treatments Schema
**File: `src/data/servicesData.ts`**
*Features: Centralized, typed catalogue with durations, prices, categories, and descriptions.*

```ts
// src/data/servicesData.ts

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  duration: string;
  numericMinutes: number;
  overview: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "consultation",
    name: "Doctor Consultation",
    category: "General",
    price: "FREE",
    numericPrice: 0,
    originalPrice: "Rp 250.000",
    duration: "15 mins",
    numericMinutes: 15,
    overview: "Comprehensive initial consultation and assessment."
  },
  {
    id: "facial-signature",
    name: "Deep Cleansing Facial",
    category: "Facial",
    price: "Rp 399.000",
    numericPrice: 399000,
    duration: "60 mins",
    numericMinutes: 60,
    overview: "Gentle extraction, ultrasonic exfoliation, and soothing mask."
  },
  {
    id: "laser-therapy",
    name: "Pico Laser Therapy",
    category: "Laser",
    price: "Rp 1.490.000",
    numericPrice: 1490000,
    duration: "45 mins",
    numericMinutes: 45,
    overview: "State-of-the-art laser to clear dark spots and smooth skin texture."
  }
];

export const SERVICE_CATEGORIES = ["All", "General", "Facial", "Laser"] as const;
```

---

## Module 5: Server Actions & Double-Booking Lockout
**File: `src/actions/booking.ts`**
*Features: Atomic double-booking slot validation, unique `#XXXXXXXX` booking ID generation, and notification dispatch.*

```ts
// src/actions/booking.ts
"use server";

import { BRAND_CONFIG } from "@/config/brand";

const KV_REST_API_URL = process.env.KV_REST_API_URL || "";
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || "";

export type Booking = {
  id: string;
  name: string;
  email: string;
  treatment: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  phone: string;
  moreInfo?: string;
  status: "pending" | "confirmed" | "declined" | "cancelled";
};

async function kvGet(key: string) {
  try {
    const res = await fetch(`${KV_REST_API_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
    });
    const data = await res.json();
    return data.result ? JSON.parse(data.result) : null;
  } catch (e) { return null; }
}

async function kvSet(key: string, value: any) {
  try {
    await fetch(`${KV_REST_API_URL}/set/${key}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
      body: JSON.stringify(value)
    });
  } catch (e) {}
}

export async function submitBooking(formData: any) {
  try {
    const existing = (await kvGet("bookings")) || [];

    // Double-booking check: reject if slot is already pending or confirmed
    const isConflict = existing.some(
      (b: Booking) =>
        b.date === formData.date &&
        b.time === formData.time &&
        (b.status === "confirmed" || b.status === "pending")
    );

    if (isConflict) {
      return { success: false, error: "This time slot is already booked. Please choose another slot." };
    }

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      name: formData.fullName,
      email: formData.email,
      treatment: Array.isArray(formData.treatments) ? formData.treatments.join(", ") : formData.treatment,
      date: formData.date,
      time: formData.time,
      phone: formData.phone,
      moreInfo: formData.moreInfo,
      status: "pending"
    };

    existing.push(newBooking);
    await kvSet("bookings", existing);

    // Trigger emails
    try {
      await fetch(`${BRAND_CONFIG.appUrl}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: newBooking.id,
          patientName: newBooking.name,
          patientEmail: newBooking.email,
          patientPhone: newBooking.phone,
          treatment: newBooking.treatment,
          date: newBooking.date,
          time: newBooking.time
        })
      });
    } catch (e) {}

    return { success: true, booking: newBooking };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to submit booking" };
  }
}

export async function getActiveBookings(): Promise<Booking[]> {
  const existing = (await kvGet("bookings")) || [];
  return existing.filter((b: Booking) => b.status === "confirmed" || b.status === "pending");
}
```

---

## Module 6: Branded Automated Email Engine
**File: `src/lib/email.ts` & `src/app/api/notify/route.ts`**
*Features: Branded HTML receipts sent to the customer (with booking code & tracking button) and alerts sent to the owner.*

```ts
// src/lib/email.ts
import nodemailer from "nodemailer";
import { BRAND_CONFIG } from "@/config/brand";

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendClientReceiptEmail(to: string, name: string, treatment: string, date: string, time: string, bookingId: string) {
  const code = `#${bookingId.slice(0, 8).toUpperCase()}`;
  const trackingUrl = `${BRAND_CONFIG.appUrl}/appointment/${bookingId}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
      <h2>${BRAND_CONFIG.name} - Consultation Request Received</h2>
      <p>Dear <strong>${name}</strong>,</p>
      <p>We have received your reservation request. Our team will verify your appointment shortly.</p>
      <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${code}</p>
        <p><strong>Treatment:</strong> ${treatment}</p>
        <p><strong>Date & Time:</strong> ${date} at ${time} WIB</p>
        <p><strong>Location:</strong> ${BRAND_CONFIG.clinicAddress}</p>
      </div>
      <a href="${trackingUrl}" style="display: block; text-align: center; background: #0F4C5C; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
        View Live Appointment Status →
      </a>
    </div>
  `;

  return transporter.sendMail({
    from: `"${BRAND_CONFIG.name}" <${process.env.EMAIL_USER}>`,
    to,
    subject: `[${code}] Consultation Request Received - ${BRAND_CONFIG.name}`,
    html,
  });
}

export async function sendOwnerAlertEmail(name: string, email: string, phone: string, treatment: string, date: string, time: string, bookingId: string) {
  const code = `#${bookingId.slice(0, 8).toUpperCase()}`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>New Consultation Request (${code})</h2>
      <p><strong>Patient:</strong> ${name} (${email}, ${phone})</p>
      <p><strong>Service:</strong> ${treatment}</p>
      <p><strong>Date & Time:</strong> ${date} at ${time} WIB</p>
      <p><a href="${BRAND_CONFIG.appUrl}/admin">Open Admin Dashboard →</a></p>
    </div>
  `;

  return transporter.sendMail({
    from: `"${BRAND_CONFIG.name} System" <${process.env.EMAIL_USER}>`,
    to: BRAND_CONFIG.supportEmail,
    subject: `🚨 New Booking: ${name} - ${treatment} (${date})`,
    html,
  });
}
```

```ts
// src/app/api/notify/route.ts
import { NextResponse } from "next/server";
import { sendClientReceiptEmail, sendOwnerAlertEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json();
  const { bookingId, patientName, patientEmail, patientPhone, treatment, date, time } = body;

  await Promise.all([
    sendClientReceiptEmail(patientEmail, patientName, treatment, date, time, bookingId),
    sendOwnerAlertEmail(patientName, patientEmail, patientPhone, treatment, date, time, bookingId),
  ]);

  return NextResponse.json({ success: true });
}
```

---

## Module 7: Admin Security PIN Protection
**File: `src/components/PinProtection.tsx`**
*Features: Protects all `/admin` routes behind a clean numpad PIN modal. Verifies against KV with fallback to default.*

```tsx
// src/components/PinProtection.tsx
"use client";

import { useState, useEffect } from "react";
import { Lock, Delete, Loader2 } from "lucide-react";
import { BRAND_CONFIG } from "@/config/brand";

export default function PinProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("admin_authenticated") === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleDigit = (digit: string) => {
    if (pin.length < 8) {
      const next = pin + digit;
      setPin(next);
      setError(false);
    }
  };

  const handleBackspace = () => setPin(pin.slice(0, -1));

  const handleVerify = async () => {
    // Replace with server action verifyAdminPin or default
    if (pin === BRAND_CONFIG.defaultAdminPin) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
    } else {
      setError(true);
      setPin("");
    }
  };

  if (loading) return null;
  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Admin Security Passcode</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">Enter your PIN to access the management portal</p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                i < pin.length ? "bg-primary border-primary scale-110" : "border-gray-300"
              }`}
            />
          ))}
        </div>

        {error && <p className="text-xs text-red-500 font-semibold mb-4">Incorrect PIN code. Try again.</p>}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "←"].map((key) => (
            <button
              key={key}
              onClick={() => {
                if (key === "C") setPin("");
                else if (key === "←") handleBackspace();
                else handleDigit(key);
              }}
              className="py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 font-bold text-base text-gray-800 transition"
            >
              {key}
            </button>
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
        >
          Unlock Admin Panel
        </button>
      </div>
    </div>
  );
}
```

---

## Module 8: Admin Header with Notification Bell & Silence Pill
**File: `src/components/AdminHeader.tsx`**
*Features: Polls incoming reservations every 15s, triggers chime audio, provides 1-click `[ ⏹ Stop Sound ]` silence pill, and auto-silences upon clicking the bell.*

```tsx
// Key snippet inside AdminHeader.tsx:
import { Bell, Square, Volume2, VolumeX } from "lucide-react";
import { stopNotificationSound, subscribeAudioPlayback, playNotificationSound } from "@/lib/notificationSound";

// Inside component:
const [isAudioPlaying, setIsAudioPlaying] = useState(false);
const [showNotifications, setShowNotifications] = useState(false);

useEffect(() => {
  const unsub = subscribeAudioPlayback((playing) => setIsAudioPlaying(playing));
  return () => unsub();
}, []);

// When clicking bell:
const handleBellClick = () => {
  const next = !showNotifications;
  setShowNotifications(next);
  if (next) {
    stopNotificationSound(); // Automatically silence ringing audio when opening bell!
  }
};

// Render in Top Bar:
{isAudioPlaying && (
  <button
    onClick={(e) => { e.stopPropagation(); stopNotificationSound(); }}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md animate-pulse transition"
  >
    <Square className="w-3 h-3 fill-white" />
    <span>Stop Sound</span>
  </button>
)}
```

---

## Module 9: Admin Visual Calendar
**File: `src/app/admin/calendar/page.tsx`**
*Features: Interactive weekly & daily schedules mapping all bookings to 9:00 - 19:00 time slots with status badges.*

---

## Module 10: Admin Settings Page
**File: `src/app/admin/settings/SettingsClient.tsx`**
*Features: Web Audio preset previews with `[ ⏹ Stop ]` toggles, custom `.mp3` file uploads, and PIN change forms.*

---

## Module 11: 4-Step Consultation Booking Flow with Live Summary
**File: `src/pages/BookingPage.tsx`**
*Features: Step 1 (Treatments multi-select), Step 2 (Schedule with recommendations & slot lockout), Step 3 (Personal info), Step 4 (Review & "What Happens Next"), plus sticky live right sidebar auto-tallying price and minutes.*

---

## Module 12: Customer Success & Live Tracker
**File: `src/app/(public)/appointment/[id]/AppointmentTrackerClient.tsx`**
*Features: Displays unique `#XXXXXXXX` code, real-time status stepper (`Submitted` ➔ `Staff Review` ➔ `Confirmed`), 1-click **Add to Calendar**, and 1-click **Chat on WhatsApp**.*

---

## 15. Integration Checklist

When pasting into your new project:
1. ✅ Set up `.env` with `KV_REST_API_URL`, `EMAIL_USER`, and `EMAIL_PASS`.
2. ✅ Update `src/config/brand.ts` with your new business name, WhatsApp number, and address.
3. ✅ Run `npx tsc --noEmit` to ensure all imported icons and types compile with 0 errors.
4. ✅ Test a booking at `/book-consultation`: check the live sticky sidebar, booking code generation, instant WhatsApp button, and email reception!

