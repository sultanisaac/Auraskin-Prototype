"use server";

import { kv } from "@vercel/kv";
import { revalidatePath } from "next/cache";

export type Booking = {
  id: string;
  name: string;
  email: string;
  treatment: string;
  date: string;
  time: string;
  phone: string;
  moreInfo?: string;
  status: "pending" | "confirmed" | "declined" | "cancelled";
  cancelReason?: string;
};

export async function getBookings(): Promise<Booking[]> {
  try {
    let bookings = await kv.get<any>("bookings");
    
    // Fix double-stringified data from the public site bug
    if (typeof bookings === 'string') {
      try {
        bookings = JSON.parse(bookings);
      } catch (e) {
        bookings = [];
      }
    }

    // Return mock data if empty for prototype purposes
    if (!bookings || !Array.isArray(bookings) || bookings.length === 0) {
      return [
        {
          id: "123",
          name: "Sarah Jenkins",
          email: "sarah@example.com",
          treatment: "Anti-Aging Facial",
          date: "2026-07-10",
          time: "14:00",
          phone: "+62 812-1234",
          moreInfo: "Looking for a specialized treatment.",
          status: "pending",
        },
        {
          id: "124",
          name: "Emily Clark",
          email: "emily.clark@example.com",
          treatment: "Acne Clear Laser",
          date: "2026-07-12",
          time: "10:30",
          phone: "+62 811-9876",
          status: "confirmed",
        }
      ];
    }
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    // Return empty array or mock if KV is not configured
    return [];
  }
}

import { sendConfirmationEmail, sendDeclinedEmail, sendCancelledEmail } from "@/lib/email";

export async function updateBookingStatus(id: string, status: "confirmed" | "declined" | "cancelled", reason?: string) {
  try {
    const bookings = await getBookings();
    
    // Find the specific booking to get customer details
    const bookingToUpdate = bookings.find(b => b.id === id);
    
    if (!bookingToUpdate) {
      return { success: false, error: "Booking not found" };
    }

    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status, cancelReason: reason || booking.cancelReason } : booking
    );
    await kv.set("bookings", updatedBookings);

    // Send the appropriate automated email
    if (bookingToUpdate.email) {
      // Don't wait for email to finish sending before responding to UI
      if (status === "confirmed") {
        sendConfirmationEmail(
          bookingToUpdate.email, 
          bookingToUpdate.name, 
          bookingToUpdate.treatment, 
          bookingToUpdate.date, 
          bookingToUpdate.time
        ).catch(console.error);
      } else if (status === "declined") {
        sendDeclinedEmail(
          bookingToUpdate.email, 
          bookingToUpdate.name, 
          bookingToUpdate.treatment, 
          bookingToUpdate.date, 
          reason
        ).catch(console.error);
      } else if (status === "cancelled") {
        sendCancelledEmail(
          bookingToUpdate.email, 
          bookingToUpdate.name, 
          bookingToUpdate.treatment, 
          bookingToUpdate.date, 
          bookingToUpdate.time, 
          reason
        ).catch(console.error);
      }
    }

    revalidatePath("/");
    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "Failed to update booking" };
  }
}

export async function deleteBookings(ids: string[]) {
  try {
    const bookings = await getBookings();
    const updatedBookings = bookings.filter((booking) => !ids.includes(booking.id));
    await kv.set("bookings", updatedBookings);
    
    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Error deleting bookings:", error);
    return { success: false, error: "Failed to delete bookings" };
  }
}

export async function createBooking(data: Partial<Booking>) {
  try {
    const bookings = await getBookings();
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || "",
      email: data.email || "",
      treatment: data.treatment || "",
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || "09:00",
      phone: data.phone || "",
      moreInfo: data.moreInfo || "",
      status: data.status || "confirmed",
    };
    await kv.set("bookings", [newBooking, ...bookings]);
    
    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/patients");
    return { success: true, booking: newBooking };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function updateBooking(id: string, data: Partial<Booking>) {
  try {
    const bookings = await getBookings();
    const updatedBookings = bookings.map(b => b.id === id ? { ...b, ...data } : b);
    await kv.set("bookings", updatedBookings);
    
    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { success: false, error: "Failed to update booking" };
  }
}

export async function updatePatientBookings(patientId: string, newData: { name: string, email: string, phone: string }) {
  try {
    const bookings = await getBookings();
    const updatedBookings = bookings.map(b => {
      const key = (b.email || b.phone).toLowerCase().trim();
      if (key === patientId) {
        return { ...b, name: newData.name, email: newData.email, phone: newData.phone };
      }
      return b;
    });
    await kv.set("bookings", updatedBookings);
    
    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Error updating patient bookings:", error);
    return { success: false, error: "Failed to update patient" };
  }
}
