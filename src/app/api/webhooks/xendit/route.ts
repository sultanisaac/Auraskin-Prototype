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

    // 4. Create Biteship Shipment
    const biteshipKey = process.env.BITESHIP_API_KEY;
    if (biteshipKey) {
      try {
        const biteshipPayload = {
          shipper_contact_name: "Auraskin Warehouse",
          shipper_contact_phone: process.env.WAREHOUSE_PHONE || "+628211715945",
          shipper_contact_email: "hello@auraskin.id",
          shipper_organization: "Auraskin",
          origin_contact_name: "Auraskin Warehouse",
          origin_contact_phone: process.env.WAREHOUSE_PHONE || "+628211715945",
          origin_address: process.env.WAREHOUSE_ADDRESS || "Bukittinggi",
          origin_area_id: process.env.WAREHOUSE_AREA_ID,
          destination_contact_name: order.customer.name,
          destination_contact_phone: order.customer.phone,
          destination_contact_email: order.customer.email,
          destination_address: order.address.line,
          destination_area_id: "", // Typically need postal code mapping, we'll use postal code
          destination_postal_code: parseInt(order.address.postal_code) || 12190,
          courier_company: order.shipping.courier.toLowerCase(),
          courier_type: order.shipping.service.toLowerCase(),
          delivery_type: "now", // 'now' or 'later' depending on biteship docs
          items: order.items.map((item: any) => ({
            name: item.name,
            description: item.name,
            value: item.price,
            quantity: item.quantity,
            weight: 200 // default 200g per item if not specified
          }))
        };

        const biteshipRes = await fetch('https://api.biteship.com/v1/orders', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${biteshipKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(biteshipPayload)
        });

        const biteshipData = await biteshipRes.json();
        
        if (biteshipRes.ok && biteshipData.success) {
          order.biteship_order_id = biteshipData.id;
          order.tracking_id = biteshipData.courier?.tracking_id;
          order.waybill_id = biteshipData.courier?.waybill_id;
          console.log(`Biteship order created: ${biteshipData.id}`);
        } else {
          console.error('Biteship API Error:', biteshipData);
          order.biteship_error = biteshipData.error || 'Failed to create shipment';
        }
      } catch (err) {
        console.error('Error calling Biteship:', err);
      }
    } else {
      console.warn('BITESHIP_API_KEY not configured, skipping shipment creation');
    }

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
