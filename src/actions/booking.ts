"use server";

const KV_REST_API_URL = process.env.KV_REST_API_URL || '';
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || '';

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

// Helper function to get data from KV via REST API
async function kvGet(key: string) {
  try {
    const res = await fetch(`${KV_REST_API_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` }
    });
    const data = await res.json();
    if (data.result) {
      try {
        return JSON.parse(data.result);
      } catch (e) {
        return data.result;
      }
    }
    return null;
  } catch (error) {
    console.error("KV Get Error:", error);
    return null;
  }
}

// Helper function to set data in KV via REST API
async function kvSet(key: string, value: any) {
  try {
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    await fetch(`${KV_REST_API_URL}/set/${key}`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      },
      body: valueStr
    });
  } catch (error) {
    console.error("KV Set Error:", error);
  }
}

export async function submitBooking(formData: any) {
  try {
    const existing = (await kvGet('bookings')) || [];

    // Double-booking prevention check
    const isConflict = existing.some(
      (b: Booking) =>
        b.date === formData.date &&
        b.time === formData.time &&
        (b.status === 'confirmed' || b.status === 'pending')
    );
    if (isConflict) {
      return { 
        success: false, 
        error: "This time slot has already been booked by another patient. Please choose another date or time." 
      };
    }
    
    const treatmentsString = Array.isArray(formData.treatments)
      ? formData.treatments.join(', ')
      : formData.treatments || 'General Consultation';

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      name: formData.fullName,
      email: formData.email,
      treatment: treatmentsString,
      date: formData.date,
      time: formData.time,
      phone: formData.phone,
      moreInfo: formData.moreInfo,
      status: 'pending'
    };
    
    existing.push(newBooking);
    await kvSet('bookings', existing);
    
    // Trigger email notifications
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
        ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '') 
        : process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'https://auraskin-prototype.vercel.app';
          
      await fetch(`${baseUrl}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch (notifyError) {
      console.error("Failed to trigger notifications:", notifyError);
      // We don't fail the booking if emails fail
    }
    
    return { success: true, booking: newBooking };
  } catch (error) {
    console.error("Error submitting booking:", error);
    return { success: false, error };
  }
}

export async function getActiveBookings() {
  try {
    const existing = (await kvGet('bookings')) || [];
    return existing.filter((b: Booking) => b.status === 'confirmed' || b.status === 'pending');
  } catch (error) {
    console.error("Error fetching active bookings:", error);
    return [];
  }
}

