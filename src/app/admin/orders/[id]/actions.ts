'use server';

import { kv } from '@vercel/kv';
import { sendOrderShippedEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderNumber: string, newStatus: string) {
  try {
    const orderKey = `order:${orderNumber}`;
    const order = await kv.get(orderKey) as any;
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    // If marked as shipped, send the shipment email
    if (newStatus === 'shipped') {
      try {
        // Send email using our new Template 3
        await sendOrderShippedEmail(order.customer.email, {
          customerName: order.customer.name,
          orderNumber: order.order_number,
          courierName: order.shipping.courier || 'Courier',
          courierService: order.shipping.service || 'Service',
          trackingNumber: order.tracking_id || order.waybill_id || 'Pending',
          // Usually biteship gives a tracking url, but as fallback we can link to Biteship site
          trackingUrl: order.tracking_id ? `https://biteship.com/track/${order.tracking_id}` : 'https://biteship.com/track',
        });
      } catch (err) {
        console.error('Failed to send shipped email:', err);
      }
    }

    await kv.set(orderKey, order);
    
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderNumber}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function requestCourier(orderNumber: string) {
  try {
    const orderKey = `order:${orderNumber}`;
    const order = await kv.get(orderKey) as any;
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.biteship_order_id) {
      return { success: false, error: 'Courier already requested' };
    }

    const biteshipKey = process.env.BITESHIP_API_KEY;
    if (!biteshipKey) {
      return { success: false, error: 'BITESHIP_API_KEY not configured' };
    }

    const biteshipPayload = {
      shipper_contact_name: "Auraskin Warehouse",
      shipper_contact_phone: process.env.WAREHOUSE_PHONE || "+628211715945",
      shipper_contact_email: "hello@auraskin.id",
      shipper_organization: "Auraskin",
      origin_contact_name: "Auraskin Warehouse",
      origin_contact_phone: process.env.WAREHOUSE_PHONE || "+628211715945",
      origin_address: process.env.WAREHOUSE_ADDRESS || "Bukittinggi",
      origin_area_id: process.env.WAREHOUSE_AREA_ID || "IDNP11IDNC233IDND2944IDZ26115", // default to Bukittinggi if not set
      origin_postal_code: 26115, // fallback postal code for origin
      destination_contact_name: order.customer.name,
      destination_contact_phone: order.customer.phone,
      destination_contact_email: order.customer.email,
      destination_address: order.address.line,
      destination_area_id: "", 
      destination_postal_code: parseInt(order.address.postal_code) || 12190,
      courier_company: order.shipping?.courier?.toLowerCase() || 'jne',
      courier_type: order.shipping?.service?.toLowerCase() || 'reg',
      delivery_type: "now", 
      items: order.items.map((item: any) => ({
        name: item.name,
        description: item.name,
        value: item.price,
        quantity: item.quantity,
        weight: 200 
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
      
      await kv.set(orderKey, order);
      
      revalidatePath('/admin/orders');
      revalidatePath(`/admin/orders/${orderNumber}`);
      
      return { success: true };
    } else {
      console.error('Biteship API Error:', biteshipData);
      return { success: false, error: biteshipData.error || 'Failed to create shipment' };
    }
  } catch (error) {
    console.error('Error requesting courier:', error);
    return { success: false, error: 'Internal server error' };
  }
}
