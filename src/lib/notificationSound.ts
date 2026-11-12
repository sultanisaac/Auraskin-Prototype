// Web Audio API based notification sound synthesizer and custom audio manager
// Produces 5 clean, clinic-tailored sound presets without external audio files,
// and supports user-uploaded custom audio files from device.

export interface SoundPreset {
  id: string;
  name: string;
  description: string;
  toneInfo: string;
}

export const NOTIFICATION_PRESETS: SoundPreset[] = [
  {
    id: "chime",
    name: "Gentle Clinic Chime",
    description: "Relaxing dual-tone bell chime crafted for a calm clinical atmosphere.",
    toneInfo: "Two-tone • A5 (880Hz) → D6 (1175Hz)",
  },
  {
    id: "crystal",
    name: "Crystal Arpeggio",
    description: "Sparkling three-tone chord with crystalline bell clarity.",
    toneInfo: "Triad • C6 (1046Hz) → E6 (1318Hz) → G6 (1568Hz)",
  },
  {
    id: "marimba",
    name: "Warm Marimba",
    description: "Earthy, organic wooden percussive strikes with warm resonance.",
    toneInfo: "Percussive • E5 (659Hz) → B5 (988Hz)",
  },
  {
    id: "zen",
    name: "Zen Sing Bowl",
    description: "Deep 432Hz holistic vibration inspired by sound healing bowls.",
    toneInfo: "Healing Resonance • 432Hz Harmonic",
  },
  {
    id: "ding",
    name: "Modern Boutique Ding",
    description: "Crisp, minimalist luxury boutique ping with high-frequency shimmer.",
    toneInfo: "Single Bell • A6 (1760Hz)",
  },
];

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/* =========================================================================
   Mute & Sound Selection Preferences
   ========================================================================= */

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("auraskin_admin_sound_muted") === "true";
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("auraskin_admin_sound_muted", muted ? "true" : "false");
}

export function getActiveSoundId(): string {
  if (typeof window === "undefined") return "chime";
  return localStorage.getItem("auraskin_admin_active_sound") || "chime";
}

export function setActiveSoundId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("auraskin_admin_active_sound", id);
}

/* =========================================================================
   Custom Sound from Device Management
   ========================================================================= */

export interface CustomSoundInfo {
  name: string;
  dataUrl: string;
  uploadedAt?: string;
}

export function getCustomSound(): CustomSoundInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("auraskin_custom_notification_sound");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

export function saveCustomSound(name: string, dataUrl: string): void {
  if (typeof window === "undefined") return;
  const payload: CustomSoundInfo = {
    name,
    dataUrl,
    uploadedAt: new Date().toISOString(),
  };
  localStorage.setItem("auraskin_custom_notification_sound", JSON.stringify(payload));
}

export function deleteCustomSound(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auraskin_custom_notification_sound");
  // If active sound was custom, revert back to default chime
  if (getActiveSoundId() === "custom") {
    setActiveSoundId("chime");
  }
}

/* =========================================================================
   5 Web Audio API Synthesizers
   ========================================================================= */

function playPresetChime(ctx: AudioContext): void {
  const now = ctx.currentTime;

  // Tone 1: 880Hz (A5)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(880, now);
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.6);

  // Tone 2: 1174.66Hz (D6)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1174.66, now + 0.1);
  gain2.gain.setValueAtTime(0, now + 0.1);
  gain2.gain.linearRampToValueAtTime(0.22, now + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.9);
}

function playPresetCrystal(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const notes = [
    { freq: 1046.5, delay: 0, duration: 0.7, vol: 0.18 }, // C6
    { freq: 1318.51, delay: 0.09, duration: 0.8, vol: 0.2 }, // E6
    { freq: 1567.98, delay: 0.18, duration: 1.0, vol: 0.22 }, // G6
  ];

  notes.forEach(({ freq, delay, duration, vol }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + delay);

    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(vol, now + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + duration);
  });
}

function playPresetMarimba(ctx: AudioContext): void {
  const now = ctx.currentTime;
  const strikes = [
    { freq: 659.25, delay: 0, duration: 0.35, vol: 0.28 }, // E5
    { freq: 987.77, delay: 0.12, duration: 0.45, vol: 0.3 }, // B5
  ];

  strikes.forEach(({ freq, delay, duration, vol }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + delay);

    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(vol, now + delay + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + duration);
  });
}

function playPresetZen(ctx: AudioContext): void {
  const now = ctx.currentTime;
  // Fundamental 432Hz
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(432, now);
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.25, now + 0.04);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 1.2);

  // Subtle shimmering overtone (864Hz)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(864, now);
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.08, now + 0.04);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.9);
}

function playPresetDing(ctx: AudioContext): void {
  const now = ctx.currentTime;
  // Single crisp high bell (A6 1760Hz)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1760, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.24, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.85);

  // Harmonics ping
  const oscHarm = ctx.createOscillator();
  const gainHarm = ctx.createGain();
  oscHarm.type = "sine";
  oscHarm.frequency.setValueAtTime(3520, now);
  gainHarm.gain.setValueAtTime(0, now);
  gainHarm.gain.linearRampToValueAtTime(0.06, now + 0.01);
  gainHarm.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  oscHarm.connect(gainHarm);
  gainHarm.connect(ctx.destination);
  oscHarm.start(now);
  oscHarm.stop(now + 0.4);
}

/* =========================================================================
   Active Playback Management & Subscriptions
   ========================================================================= */

let activeAudioElement: HTMLAudioElement | null = null;
let activeAudioTimeout: ReturnType<typeof setTimeout> | null = null;
let currentPlayingSoundId: string | null = null;
const audioListeners = new Set<(isPlaying: boolean, soundId?: string | null) => void>();

function notifyAudioState(isPlaying: boolean, soundId?: string | null): void {
  currentPlayingSoundId = isPlaying ? (soundId || currentPlayingSoundId || "audio") : null;
  audioListeners.forEach((listener) => {
    try {
      listener(isPlaying, currentPlayingSoundId);
    } catch (e) {
      console.warn("Error in audio listener:", e);
    }
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("auraskin_audio_playback_changed", {
        detail: { isPlaying, soundId: currentPlayingSoundId },
      })
    );
  }
}

/**
 * Checks whether an audio ringtone or preview is currently playing.
 */
export function isNotificationAudioPlaying(): boolean {
  if (activeAudioElement && !activeAudioElement.paused && !activeAudioElement.ended) {
    return true;
  }
  return currentPlayingSoundId !== null;
}

/**
 * Returns the ID of the currently playing sound (e.g. "custom", "chime", or null).
 */
export function getCurrentPlayingSoundId(): string | null {
  return currentPlayingSoundId;
}

/**
 * Subscribes to audio playback changes (started or stopped).
 * Returns an unsubscribe callback.
 */
export function subscribeAudioPlayback(
  listener: (isPlaying: boolean, soundId?: string | null) => void
): () => void {
  audioListeners.add(listener);
  // Send immediate state to newly mounted listener
  listener(isNotificationAudioPlaying(), currentPlayingSoundId);
  return () => {
    audioListeners.delete(listener);
  };
}

/**
 * Immediately stops any currently playing notification audio, ringtone, or preview.
 */
export function stopNotificationSound(): void {
  if (activeAudioTimeout) {
    clearTimeout(activeAudioTimeout);
    activeAudioTimeout = null;
  }
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {}
    activeAudioElement = null;
  }
  notifyAudioState(false, null);
}

/* =========================================================================
   Playback Router (Presets & Custom)
   ========================================================================= */

function playCustomAudio(dataUrl: string, soundId: string = "custom", autoStopSec?: number): void {
  stopNotificationSound();

  try {
    const audio = new Audio(dataUrl);
    audio.volume = 0.85;
    activeAudioElement = audio;

    audio.onplay = () => {
      notifyAudioState(true, soundId);
    };

    audio.onpause = () => {
      notifyAudioState(false, null);
    };

    audio.onended = () => {
      if (activeAudioElement === audio) {
        activeAudioElement = null;
      }
      notifyAudioState(false, null);
    };

    audio.onerror = () => {
      if (activeAudioElement === audio) {
        activeAudioElement = null;
      }
      notifyAudioState(false, null);
    };

    // Auto-stop safety timer (e.g. 30 seconds for background notification ringtone)
    if (autoStopSec && autoStopSec > 0) {
      activeAudioTimeout = setTimeout(() => {
        stopNotificationSound();
      }, autoStopSec * 1000);
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Could not play custom audio element, fallback to preset chime:", err);
        notifyAudioState(false, null);
        const ctx = getAudioContext();
        if (ctx) playPresetChime(ctx);
      });
    }
  } catch (err) {
    console.warn("Custom audio playback failed:", err);
    notifyAudioState(false, null);
  }
}

/**
 * Preview any sound by ID (or test custom dataUrl directly).
 * If the sound is already playing, calling previewSound with the same ID will stop it.
 */
export function previewSound(soundId: string, customDataUrl?: string): void {
  // If this sound is currently playing, clicking it stops it (toggle behavior)
  if (isNotificationAudioPlaying() && currentPlayingSoundId === soundId) {
    stopNotificationSound();
    return;
  }

  stopNotificationSound();

  if (soundId === "custom") {
    const url = customDataUrl || getCustomSound()?.dataUrl;
    if (url) {
      playCustomAudio(url, "custom");
      return;
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  notifyAudioState(true, soundId);

  switch (soundId) {
    case "crystal":
      playPresetCrystal(ctx);
      break;
    case "marimba":
      playPresetMarimba(ctx);
      break;
    case "zen":
      playPresetZen(ctx);
      break;
    case "ding":
      playPresetDing(ctx);
      break;
    case "chime":
    default:
      playPresetChime(ctx);
      break;
  }

  // Preset synthesizers are brief (~1s), reset state automatically
  activeAudioTimeout = setTimeout(() => {
    notifyAudioState(false, null);
  }, 1200);
}

/**
 * Plays the currently active notification sound (preset or custom audio).
 * For custom ringtones, includes a 30-second safety timeout.
 * Respects global mute.
 */
export function playNotificationSound(): void {
  if (isSoundMuted()) return;

  stopNotificationSound();

  const activeId = getActiveSoundId();
  if (activeId === "custom") {
    const custom = getCustomSound();
    if (custom?.dataUrl) {
      // 30 seconds safety timeout so background alerts don't loop/play indefinitely if away
      playCustomAudio(custom.dataUrl, "custom", 30);
      return;
    }
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  notifyAudioState(true, activeId);

  switch (activeId) {
    case "crystal":
      playPresetCrystal(ctx);
      break;
    case "marimba":
      playPresetMarimba(ctx);
      break;
    case "zen":
      playPresetZen(ctx);
      break;
    case "ding":
      playPresetDing(ctx);
      break;
    case "chime":
    default:
      playPresetChime(ctx);
      break;
  }

  activeAudioTimeout = setTimeout(() => {
    notifyAudioState(false, null);
  }, 1200);
}
