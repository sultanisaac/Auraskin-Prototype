import Header from "@/components/AdminHeader";
import { getBookings } from "@/actions/kv";
import { kv } from "@vercel/kv";
import SettingsClient from "./SettingsClient";

export const revalidate = 0;

export default async function SettingsPage() {
  let totalActionable = 0;
  try {
    const bookings = await getBookings();
    const pendingCount = bookings.filter((b) => b.status === "pending").length;
    let paidOrdersCount = 0;
    const orderIds = await kv.zrange("orders:list", 0, 29, { rev: true });
    if (orderIds && orderIds.length > 0) {
      for (const id of orderIds) {
        try {
          const order: any = await kv.get(`order:${id}`);
          if (order && order.status?.toLowerCase() === "paid") {
            paidOrdersCount++;
          }
        } catch (e) {}
      }
    }
    totalActionable = pendingCount + paidOrdersCount;
  } catch (e) {
    console.warn("Could not calculate pending count for settings page:", e);
  }

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header
        title="Settings"
        subtitle="System preferences, admin security PIN, and notification sounds"
        pendingCount={totalActionable}
      />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-gray-50/30">
        <div className="max-w-4xl mx-auto">
          <SettingsClient />
        </div>
      </div>
    </main>
  );
}

