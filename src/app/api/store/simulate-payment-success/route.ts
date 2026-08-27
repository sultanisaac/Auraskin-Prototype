import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  try {
    const { orderNumber } = await req.json();

    if (!orderNumber) {
      return NextResponse.json({ error: 'Missing orderNumber' }, { status: 400 });
    }

    // 1. Find the order in Vercel KV
    const orderKey = `order:${orderNumber}`;
    const order = await kv.get(orderKey) as any;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Prevent duplicate processing
    if (order.status === 'paid') {
      return NextResponse.json({ success: true, message: 'Order already marked as paid' });
    }

    // 3. Update order status to PAID (Simulated)
    order.status = 'paid';
    order.paid_at = new Date().toISOString();
    order.payment_method = order.payment_method || 'SIMULATED';
    
    // Decrement Stock
    try {
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          if (item.id) {
            const product = await kv.get(`product:${item.id}`) as any;
            if (product && product.stock !== undefined) {
              product.stock = Math.max(0, product.stock - item.quantity);
              await kv.set(`product:${item.id}`, product);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error decrementing stock:', err);
    }

    // Save updated order back to KV
    await kv.set(orderKey, order);

    return NextResponse.json({ success: true, message: 'Order simulated as paid' });
  } catch (error) {
    console.error('Simulate Payment Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
