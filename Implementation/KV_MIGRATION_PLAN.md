# AuraSkin Public Website: Cal.com to Vercel KV Migration Plan

This document outlines the step-by-step process for removing Cal.com from the **Public AuraSkin Prototype** and replacing it with a custom booking flow connected directly to Vercel KV.

## Phase 1: Environment & Dependencies

1. **Install Vercel KV SDK:**
   Open your terminal in the `Auraskin-Prototype` folder and run:
   ```bash
   npm install @vercel/kv
   ```
2. **Sync Environment Variables:**
   You must pull the exact same KV keys you used in the Admin project.
   ```bash
   vercel env pull .env.local
   ```
   *Verify your `.env.local` now contains `KV_REST_API_URL` and `KV_REST_API_TOKEN`.*

## Phase 2: Remove Cal.com

1. **Uninstall the Package:**
   ```bash
   npm uninstall @calcom/embed-react
   ```
2. **Clean Up the Booking Modal/Page:**
   - Open your `BookingModal` or `BookingPage.tsx` (wherever Cal.com was rendered).
   - Delete all `<Cal />` components and related `cal.com` imports.

## Phase 3: Create the KV Server Actions

Create a new file `src/actions/kv.ts` to handle the database communication securely.

1. **Fetch Confirmed Bookings (To prevent double-booking):**
   ```typescript
   import { kv } from '@vercel/kv';

   export async function getConfirmedBookings() {
     const bookings = await kv.get('bookings') || [];
     // Return only confirmed ones so we can block out those times
     return bookings.filter(b => b.status === 'confirmed');
   }
   ```
2. **Submit a New Booking:**
   ```typescript
   export async function submitBooking(bookingData) {
     const existingBookings = await kv.get('bookings') || [];
     
     const newBooking = {
       id: crypto.randomUUID(),
       ...bookingData, // name, phone, treatment, date, time
       status: 'pending'
     };

     existingBookings.push(newBooking);
     await kv.set('bookings', existingBookings);
     return { success: true };
   }
   ```

## Phase 4: Custom Booking UI (The Code)

Since Cal.com is gone, here is the custom React component you can use to let users pick a date and time. It matches the AuraSkin branding (Deep Emerald Teal & Champagne Gold).

```tsx
import { useState, useEffect } from 'react';
import { getConfirmedBookings, submitBooking } from '@/actions/kv';

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

export default function BookingPicker() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmedSlots, setConfirmedSlots] = useState([]);

  // Fetch confirmed bookings whenever the date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    async function checkAvailability() {
      const bookings = await getConfirmedBookings();
      // Find times booked for the selected date
      const bookedTimesForDate = bookings
        .filter((b) => b.date === selectedDate)
        .map((b) => b.time);
      
      setConfirmedSlots(bookedTimesForDate);
    }
    checkAvailability();
  }, [selectedDate]);

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return alert("Please pick date and time.");
    
    await submitBooking({
      name: "Guest", // Replace with actual form state
      treatment: "Consultation",
      date: selectedDate,
      time: selectedTime,
    });
    alert("Request Sent! We will confirm shortly.");
  };

  return (
    <div className="bg-[#FAF8F4] p-6 rounded-2xl max-w-md mx-auto shadow-sm border border-[#E8DCCB]">
      <h3 className="text-2xl font-bold font-playfair text-[#1F2937] mb-6">Select Appointment</h3>
      
      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#6B7280] mb-2">Choose Date</label>
        <input 
          type="date" 
          className="w-full p-3 rounded-xl border border-[#E8DCCB] focus:outline-none focus:border-[#0F4C5C] focus:ring-1 focus:ring-[#0F4C5C]"
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime(""); // Reset time when date changes
          }}
        />
      </div>

      {/* Time Picker Grid */}
      {selectedDate && (
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#6B7280] mb-2">Available Times</label>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((time) => {
              const isBooked = confirmedSlots.includes(time);
              const isSelected = selectedTime === time;
              
              return (
                <button
                  key={time}
                  disabled={isBooked}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 rounded-md font-medium transition-all duration-300
                    ${isBooked 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50' 
                      : isSelected
                        ? 'bg-[#0F4C5C] text-white shadow-md'
                        : 'border-2 border-[#0F4C5C] text-[#0F4C5C] hover:bg-[#0F4C5C]/10'
                    }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <button 
        onClick={handleBook}
        disabled={!selectedDate || !selectedTime}
        className="w-full bg-[#D4B483] text-white py-3 rounded-md font-medium hover:bg-[#b59564] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirm & Book
      </button>
    </div>
  );
}
```

## Final Checklist
- [ ] Cal.com is completely removed from the project.
- [ ] The custom `BookingPicker` UI is rendering inside your modal.
- [ ] Selecting a time and clicking book successfully writes a JSON object to Vercel KV.
- [ ] If the Admin site changes that booking to "confirmed", this public UI accurately disables the greyed out time slot.
