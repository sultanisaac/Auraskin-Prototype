import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { sendPaymentConfirmedEmail, sendAdminNewOrderEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    // 1. Verify Xendit Callback Token
    const callbackToken = req.headers.get('x-callback-token');
    if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
      console.error('Invalid Xendit Callback Token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    
    // We only care about PAID or SETTLED invoices
    if (payload.status !== 'PAID' && payload.status !== 'SETTLED') {
      return NextResponse.json({ message: 'Ignored non-paid status' }, { status: 200 });
    }

    const orderNumber = payload.external_id;
    if (!orderNumber) {
      return NextResponse.json({ error: 'Missing external_id' }, { status: 400 });
    }

    // 2. Find the order in Vercel KV
    const orderKey = `order:${orderNumber}`;
    const order = await kv.get(orderKey) as any;

    if (!order) {
      console.error(`Order ${orderNumber} not found in KV`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Prevent duplicate processing
    if (order.status === 'paid') {
      return NextResponse.json({ message: 'Order already processed' }, { status: 200 });
    }

    // 3. Update order status to PAID
    order.status = 'paid';
    order.paid_at = new Date().toISOString();
    order.payment_method = payload.payment_method;
    order.payment_channel = payload.payment_channel;

    // 3.5 Decrement Stock for each item
    try {
      for (const item of order.items) {
        if (item.id) {
          const product = await kv.get(`product:${item.id}`) as any;
          if (product && product.stock !== undefined) {
            product.stock = Math.max(0, product.stock - item.quantity);
            await kv.set(`product:${item.id}`, product);
          }
        }
      }
    } catch (err) {
      console.error('Error decrementing stock:', err);
    }

    // (Biteship shipment creation moved to manual trigger in Admin Dashboard)

    // 5. Save updated order back to KV
    await kv.set(orderKey, order);

    // 6. Send Email Receipt
    try {
      const subtotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
      await sendPaymentConfirmedEmail(order.customer.email, {
        customerName: order.customer.name,
        orderNumber: orderNumber,
        items: order.items,
        subtotal: subtotal,
        shippingCost: order.shipping_cost || 0,
        courier: order.shipping?.courier || 'Courier',
        total: order.total || 0,
        customerPhone: order.customer.phone,
        customerAddress: order.address.line,
        customerCityZip: `${order.address.city}, ${order.address.postal_code}`
      });

      // 7. Send New Order Notification to Admin
      await sendAdminNewOrderEmail({
        orderNumber: orderNumber,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        total: order.total || 0,
        courierName: order.shipping?.courier || 'Courier',
        courierService: order.shipping?.service || 'Service',
        items: order.items,
        customerAddress: order.address.line,
        customerCityZip: `${order.address.city}, ${order.address.postal_code}`,
        trackingNumber: order.tracking_id || 'Pending Pickup',
        biteshipOrderId: order.biteship_order_id || 'Pending'
      });
    } catch (err) {
      console.error('Failed to send receipt email', err);
    }
    return NextResponse.json({ success: true, message: 'Order processed successfully' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
