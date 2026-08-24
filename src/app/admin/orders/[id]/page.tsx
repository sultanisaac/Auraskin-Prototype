import { kv } from '@vercel/kv';
import { Package, ArrowLeft, Truck, CheckCircle, Clock, XCircle, MapPin, CreditCard, Box } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OrderStatusActions } from './OrderStatusActions';

export const revalidate = 0;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const orderNumber = resolvedParams.id;
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
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const subtotal = order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back button & Header */}
        <div>
          <Link href="/admin/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Orders
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-500 mt-1">
                Placed on {new Date(order.created_at).toLocaleString('en-ID', { dateStyle: 'full', timeStyle: 'short' })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusBadge(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
              {order.status?.toLowerCase() === 'paid' && order.biteship_order_id && (
                <a 
                  href={`/admin/orders/${order.order_number}/receipt`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Print Resi (Shipping Label)
                </a>
              )}
              {order.status?.toLowerCase() === 'paid' && !order.biteship_order_id && (
                <span className="text-sm text-gray-500 italic">Please request courier on the Orders List</span>
              )}
              <OrderStatusActions orderNumber={order.order_number} currentStatus={order.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column - Items & Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Box className="w-5 h-5 text-primary" />
                Order Items
              </h2>
              
              <div className="divide-y divide-gray-100 border-t border-b border-gray-100 mb-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping ({order.shipping.courier})</span>
                  <span>{formatPrice(order.shipping.cost || 25000)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Logistics Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-500" />
                Logistics & Tracking
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Courier</p>
                  <p className="font-medium text-gray-900 uppercase">{order.shipping.courier} - {order.shipping.service}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Biteship Order ID</p>
                  <p className="font-medium text-gray-900">{order.biteship_order_id || 'Pending creation'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Tracking Number / Waybill</p>
                  <p className="font-medium text-gray-900">{order.tracking_id || order.waybill_id || 'Not generated yet'}</p>
                </div>
              </div>
            </div>

          </div>
          
          {/* Sidebar Column - Customer & Payment */}
          <div className="space-y-6">
            
            {/* Customer Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Customer Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">{order.customer.name}</p>
                  <a href={`mailto:${order.customer.email}`} className="text-sm text-primary hover:underline block">{order.customer.email}</a>
                  <p className="text-sm text-gray-600">{order.customer.phone}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-100 text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">Shipping Address</p>
                  <p>{order.address.line}</p>
                  <p>{order.address.city}, {order.address.province}</p>
                  <p>{order.address.postal_code}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                Payment
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium ${order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered' ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                {order.paid_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Paid At</span>
                    <span className="text-gray-900">{new Date(order.paid_at).toLocaleString('en-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                )}
                {order.xendit_invoice_id && (
                  <div className="flex flex-col gap-1 pt-3 border-t border-gray-100">
                    <span className="text-gray-500">Xendit Invoice ID</span>
                    <span className="text-gray-900 font-mono text-xs break-all">{order.xendit_invoice_id}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="text-gray-900 font-medium">
                    {order.payment_method ? order.payment_method.replace(/_/g, ' ').toUpperCase() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Payment Channel</span>
                  <span className="text-gray-900">
                    {order.payment_channel ? order.payment_channel.replace(/_/g, ' ').toUpperCase() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
