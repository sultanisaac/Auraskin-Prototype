const KV_REST_API_URL = import.meta.env.VITE_KV_REST_API_URL || '';
const KV_REST_API_TOKEN = import.meta.env.VITE_KV_REST_API_TOKEN || '';

export type Booking = {
  id: string;
  name: string;
  email: string;
  treatment: string;
  date: string;
  time: string;
  phone: string;
  moreInfo?: string;
  status: "pending" | "confirmed" | "declined";
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
    
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      name: formData.fullName,
      email: formData.email,
      treatment: formData.treatments.join(', '),
      date: formData.date,
      time: formData.time,
      phone: formData.phone,
      moreInfo: formData.moreInfo,
      status: 'pending'
    };
    
    existing.push(newBooking);
    await kvSet('bookings', existing);
    
    return { success: true, booking: newBooking };
  } catch (error) {
    console.error("Error submitting booking:", error);
    return { success: false, error };
  }
}

export async function getConfirmedBookings() {
  try {
    const existing = (await kvGet('bookings')) || [];
    return existing.filter((b: Booking) => b.status === 'confirmed');
  } catch (error) {
    console.error("Error fetching confirmed bookings:", error);
    return [];
  }
}
