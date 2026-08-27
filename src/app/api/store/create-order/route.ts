import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { sendOrderCreatedEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer, address, shipping } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Calculate total server-side
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const shippingCost = shipping?.price || 0;
    const totalAmount = subtotal + shippingCost;

    // 2. Generate unique order number
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderNumber = `AURA-${dateString}-${randomId}`;

    // 3. Skip Xendit Invoice for now to test Custom Payment Page
    // (We will handle payment separately in the new custom page)

    // 4. Save order to KV
    const orderData = {
      order_number: orderNumber,
      status: 'pending',
      customer,
      address,
      shipping,
      items,
      subtotal,
      shipping_cost: shippingCost,
      total: totalAmount,
      created_at: new Date().toISOString()
    };

    // Save under the key order:{orderNumber}
    await kv.set(`order:${orderNumber}`, orderData);
    
    // Also save it to a list of orders for the admin dashboard
    await kv.zadd('orders:list', { score: Date.now(), member: orderNumber });

    // Send the Order Created Email
    await sendOrderCreatedEmail(customer.email, {
      customerName: customer.name,
      orderNumber: orderNumber,
      invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/store/payment?order=${orderNumber}`,
      items: items,
      subtotal: subtotal,
      shippingCost: shippingCost,
      courier: shipping?.courier || 'Courier',
      total: totalAmount
    });

    return NextResponse.json({ 
      success: true, 
      payment_url: `/store/payment?order=${orderNumber}`,
      order_number: orderNumber
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
