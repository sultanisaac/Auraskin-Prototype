import { createClient } from '@vercel/kv';

// We must create a custom client for Vite since process.env is not available
// Make sure to add VITE_KV_REST_API_URL and VITE_KV_REST_API_TOKEN to your .env.local
const kv = createClient({
  url: import.meta.env.VITE_KV_REST_API_URL || '',
  token: import.meta.env.VITE_KV_REST_API_TOKEN || '',
});

export type Booking = {
  id: string;
  name: string;
  treatment: string;
  date: string;
  time: string;
  phone: string;
  status: "pending" | "confirmed" | "declined";
};

export async function submitBooking(formData: any) {
  try {
    const existing = await kv.get<Booking[]>('bookings') || [];
    
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      name: formData.fullName,
      treatment: formData.treatments.join(', '),
      date: formData.date,
      time: formData.time,
      phone: formData.phone,
      status: 'pending'
    };
    
    existing.push(newBooking);
    await kv.set('bookings', existing);
    
    return { success: true, booking: newBooking };
  } catch (error) {
    console.error("Error submitting booking:", error);
    return { success: false, error };
  }
}

export async function getConfirmedBookings() {
  try {
    const existing = await kv.get<Booking[]>('bookings') || [];
    return existing.filter(b => b.status === 'confirmed');
  } catch (error) {
    console.error("Error fetching confirmed bookings:", error);
    return [];
  }
}
