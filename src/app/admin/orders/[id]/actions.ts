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
