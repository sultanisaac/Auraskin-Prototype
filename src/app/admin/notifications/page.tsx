import Header from "@/components/AdminHeader";
import { getBookings } from "@/actions/kv";
import NotificationsClient from "@/components/NotificationsClient";

export default async function NotificationsPage() {
  const bookings = await getBookings();
  const pendingCount = bookings.filter(b => b.status === "pending").length;

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header title="Notifications" subtitle="Recent booking activities and alerts" pendingCount={pendingCount} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-gray-50/30">
        <div className="max-w-4xl mx-auto">
          <NotificationsClient bookings={bookings} />
        </div>
      </div>
    </main>
  );
}
