import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';
import PrintButtons from './PrintButtons';

export const revalidate = 0;

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const orderNumber = params.id;
  const orderKey = `order:${orderNumber}`;
  
  const order = await kv.get(orderKey) as any;
  
  if (!order) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  const subtotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  return (
    <div className="bg-white text-black min-h-screen p-8 max-w-3xl mx-auto font-sans">
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-bold font-serif mb-2">AURASKIN</h1>
          <p className="text-gray-600">Official Receipt</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl">Order #{order.order_number}</p>
          <p className="text-gray-600">Date: {new Date(order.created_at).toLocaleDateString('en-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-gray-600">Status: {order.status?.toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold border-b border-gray-300 pb-2 mb-3">Customer Info</h3>
          <p className="font-medium">{order.customer?.name}</p>
          <p className="text-sm">{order.customer?.email}</p>
          <p className="text-sm">{order.customer?.phone}</p>
        </div>
        <div>
          <h3 className="font-bold border-b border-gray-300 pb-2 mb-3">Shipping Address</h3>
          <p className="text-sm">{order.address?.line}</p>
          <p className="text-sm">{order.address?.city}, {order.address?.province}</p>
          <p className="text-sm">{order.address?.postal_code}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold border-b border-gray-300 pb-2 mb-3">Payment Info</h3>
          <p className="text-sm"><span className="font-medium">Method:</span> {order.payment_method ? order.payment_method.replace(/_/g, ' ').toUpperCase() : 'N/A'}</p>
          <p className="text-sm"><span className="font-medium">Channel:</span> {order.payment_channel ? order.payment_channel.replace(/_/g, ' ').toUpperCase() : 'N/A'}</p>
          {order.paid_at && <p className="text-sm"><span className="font-medium">Paid At:</span> {new Date(order.paid_at).toLocaleString('en-ID')}</p>}
        </div>
        <div>
          <h3 className="font-bold border-b border-gray-300 pb-2 mb-3">Shipping Info</h3>
          <p className="text-sm"><span className="font-medium">Courier:</span> {order.shipping?.courier?.toUpperCase()}</p>
          <p className="text-sm"><span className="font-medium">Service:</span> {order.shipping?.service?.toUpperCase()}</p>
          {order.tracking_id && <p className="text-sm"><span className="font-medium">Tracking:</span> {order.tracking_id}</p>}
        </div>
      </div>

      <table className="w-full mb-8 text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-3 font-bold">Item</th>
            <th className="py-3 font-bold text-center">Qty</th>
            <th className="py-3 font-bold text-right">Price</th>
            <th className="py-3 font-bold text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item: any, i: number) => (
            <tr key={i} className="border-b border-gray-200">
              <td className="py-4">
                <p className="font-medium">{item.name}</p>
              </td>
              <td className="py-4 text-center">{item.quantity}</td>
              <td className="py-4 text-right">{formatPrice(item.price)}</td>
              <td className="py-4 text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-1/2">
          <div className="flex justify-between py-2 text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-200">
            <span>Shipping Cost</span>
            <span>{formatPrice(order.shipping_cost || 0)}</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(order.total || order.totalAmount)}</span>
          </div>
        </div>
      </div>

      <PrintButtons />

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
