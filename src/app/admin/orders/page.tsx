import { kv } from '@vercel/kv';
import OrdersTableClient from './OrdersTableClient';
import Header from "@/components/AdminHeader";

export const revalidate = 0; // Disable cache for admin dashboard

export default async function OrdersAdminPage() {
  // Fetch all order IDs from the ZSET (sorted by score/time)
  const orderIds = await kv.zrange('orders:list', 0, -1, { rev: true });
  
  const orders = [];
  
  if (orderIds && orderIds.length > 0) {
    // Fetch details for each order ID
    for (const id of orderIds) {
      const order = await kv.get(`order:${id}`);
      if (order) {
        orders.push(order as any);
      }
    }
  }

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header title="Orders" subtitle="View and manage customer e-commerce orders" />
      
      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          <OrdersTableClient orders={orders} />
        </div>
      </div>
    </main>
  );
}
