import { NextResponse } from 'next/server';
import { getBookings } from '@/actions/kv';
import { kv } from '@vercel/kv';

export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch pending bookings (reservation requests)
    const allBookings = await getBookings();
    const pendingBookings = allBookings
      .filter(b => b.status === 'pending')
      .map(b => ({
        id: b.id,
        name: b.name,
        treatment: b.treatment,
        date: b.date,
        time: b.time,
        phone: b.phone || '',
        email: b.email || '',
        moreInfo: b.moreInfo || '',
        status: b.status,
      }));

    // 2. Fetch paid orders (customers paid for products)
    const paidOrders: any[] = [];
    try {
      const orderIds = await kv.zrange('orders:list', 0, 29, { rev: true });
      if (orderIds && orderIds.length > 0) {
        for (const id of orderIds) {
          try {
            const order: any = await kv.get(`order:${id}`);
            if (order && order.status?.toLowerCase() === 'paid') {
              paidOrders.push({
                ...order,
                order_number: order.order_number,
                customer_name: order.customer?.name || 'Customer',
                customer_email: order.customer?.email || '',
                total: order.total || order.totalAmount || 0,
                paid_at: order.paid_at || order.created_at,
                item_count: order.items?.reduce((acc: number, it: any) => acc + (it.quantity || 1), 0) || 1,
                status: order.status,
              });
            }
          } catch (e) {
            // Ignore individual fetch failure
          }
        }
      }
    } catch (orderErr) {
      console.warn('Could not fetch orders for notifications summary:', orderErr);
    }

    const totalCount = pendingBookings.length + paidOrders.length;

    return NextResponse.json({
      success: true,
      pendingBookings,
      paidOrders,
      bookingCount: pendingBookings.length,
      paidOrderCount: paidOrders.length,
      totalCount,
    });
  } catch (error) {
    console.error('Error in notifications-summary API:', error);
    return NextResponse.json({
      success: false,
      pendingBookings: [],
      paidOrders: [],
      bookingCount: 0,
      paidOrderCount: 0,
      totalCount: 0,
    });
  }
}

