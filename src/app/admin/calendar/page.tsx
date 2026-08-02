import Header from "@/components/AdminHeader";
import Calendar from "@/components/Calendar";
import { getBookings } from "@/actions/kv";

export default async function CalendarPage() {
  const bookings = await getBookings();
  const pendingCount = bookings.filter(b => b.status === "pending").length;

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header title="Calendar" subtitle="Visual overview of clinic schedule" pendingCount={pendingCount} />

      <div className="flex-1 p-4 md:p-8 overflow-hidden flex flex-col">
        <Calendar initialBookings={bookings} />
      </div>
    </main>
  );
}
