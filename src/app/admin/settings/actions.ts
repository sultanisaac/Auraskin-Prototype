"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

const DEFAULT_PIN = "271302";
const PIN_KEY = "admin_pin_code";

/**
 * Retrieves the current status of the admin PIN (whether it's default or custom).
 * Does not expose the full PIN for security.
 */
export async function getAdminPinStatus(): Promise<{
  isCustom: boolean;
  pinLength: number;
  maskedHint: string;
}> {
  try {
    const currentPin = await kv.get<string>(PIN_KEY);
    const activePin = currentPin || DEFAULT_PIN;
    const isCustom = Boolean(currentPin && currentPin !== DEFAULT_PIN);
    const lastTwo = activePin.slice(-2);
    const masked = "•".repeat(Math.max(0, activePin.length - 2)) + lastTwo;

    return {
      isCustom,
      pinLength: activePin.length,
      maskedHint: masked,
    };
  } catch (error) {
    console.warn("Could not check PIN status in KV, using default:", error);
    return {
      isCustom: false,
      pinLength: DEFAULT_PIN.length,
      maskedHint: "••••02",
    };
  }
}

/**
 * Verifies whether the entered PIN matches the currently configured PIN.
 */
export async function verifyAdminPin(enteredPin: string): Promise<boolean> {
  if (!enteredPin) return false;
  try {
    const storedPin = await kv.get<string>(PIN_KEY);
    const validPin = storedPin || DEFAULT_PIN;
    return enteredPin.trim() === validPin.trim();
  } catch (error) {
    console.warn("Error reading PIN from KV, falling back to default verification:", error);
    return enteredPin.trim() === DEFAULT_PIN;
  }
}

/**
 * Updates the admin PIN code. Requires confirming current PIN first.
 */
export async function updateAdminPin(
  currentPin: string,
  newPin: string
): Promise<{ success: boolean; message: string }> {
  try {
    const isCurrentValid = await verifyAdminPin(currentPin);
    if (!isCurrentValid) {
      return { success: false, message: "Current PIN code is incorrect." };
    }

    const trimmedNewPin = newPin.trim();
    if (!/^\d{4,8}$/.test(trimmedNewPin)) {
      return { success: false, message: "New PIN must be between 4 and 8 digits (numbers only)." };
    }

    await kv.set(PIN_KEY, trimmedNewPin);
    revalidatePath("/admin/settings");
    return { success: true, message: "Admin access PIN has been updated successfully!" };
  } catch (error: any) {
    console.error("Failed to update PIN in KV:", error);
    return { success: false, message: "Failed to update PIN. Please check database connection." };
  }
}

/**
 * Resets the admin access PIN back to the default code (271302).
 */
export async function resetAdminPinToDefault(
  currentPin: string
): Promise<{ success: boolean; message: string }> {
  try {
    const isCurrentValid = await verifyAdminPin(currentPin);
    if (!isCurrentValid) {
      return { success: false, message: "Current PIN code is incorrect." };
    }

    await kv.set(PIN_KEY, DEFAULT_PIN);
    revalidatePath("/admin/settings");
    return { success: true, message: "Admin access PIN has been reset to default (271302)." };
  } catch (error: any) {
    console.error("Failed to reset PIN in KV:", error);
    return { success: false, message: "Failed to reset PIN. Please check database connection." };
  }
}

