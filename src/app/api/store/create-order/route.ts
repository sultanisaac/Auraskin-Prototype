import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

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

    // 3. Call Xendit to create Invoice
    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    if (!xenditSecretKey) {
      console.error('Missing Xendit Secret Key');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const authHeader = `Basic ${Buffer.from(xenditSecretKey + ':').toString('base64')}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        external_id: orderNumber,
        amount: totalAmount,
        payer_email: customer.email,
        description: `Auraskin Order ${orderNumber}`,
        success_redirect_url: `${appUrl}/store/success?order=${orderNumber}`,
        failure_redirect_url: `${appUrl}/store/checkout?error=payment_failed`,
        currency: "IDR",
        items: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      })
    });

    const xenditData = await xenditResponse.json();

    if (!xenditResponse.ok) {
      console.error('Xendit Error:', xenditData);
      return NextResponse.json({ error: 'Failed to create payment invoice' }, { status: 500 });
    }

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
      xendit_invoice_id: xenditData.id,
      xendit_invoice_url: xenditData.invoice_url,
      created_at: new Date().toISOString()
    };

    // Save under the key order:{orderNumber}
    await kv.set(`order:${orderNumber}`, orderData);
    
    // Also save it to a list of orders for the admin dashboard
    await kv.zadd('orders:list', { score: Date.now(), member: orderNumber });

    return NextResponse.json({ 
      success: true, 
      invoice_url: xenditData.invoice_url,
      order_number: orderNumber
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
