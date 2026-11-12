import Header from "@/components/AdminHeader";
import { getBookings } from "@/actions/kv";
import { kv } from "@vercel/kv";
import NotificationsClient from "@/components/NotificationsClient";

export const revalidate = 0;

export default async function NotificationsPage() {
  const bookings = await getBookings();
  const pendingCount = bookings.filter(b => b.status === "pending").length;

  const paidOrders: any[] = [];
  try {
    const orderIds = await kv.zrange('orders:list', 0, 29, { rev: true });
    if (orderIds && orderIds.length > 0) {
      for (const id of orderIds) {
        try {
          const order: any = await kv.get(`order:${id}`);
          if (order && order.status?.toLowerCase() === 'paid') {
            paidOrders.push(order);
          }
        } catch (e) {}
      }
    }
  } catch (e) {
    console.warn("Could not load paid orders for notifications page:", e);
  }

  const totalActionable = pendingCount + paidOrders.length;

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header title="Notifications" subtitle="Recent booking activities, alerts, and paid store orders" pendingCount={totalActionable} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-gray-50/30">
        <div className="max-w-4xl mx-auto">
          <NotificationsClient bookings={bookings} paidOrders={paidOrders} />
        </div>
      </div>
    </main>
  );
}
