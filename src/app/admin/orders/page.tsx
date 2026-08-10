import { kv } from '@vercel/kv';
import { Package, Search, ExternalLink, Clock, CheckCircle, Truck, PackageCheck, XCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Disable cache for admin dashboard

export default async function OrdersAdminPage() {
  // Fetch all order IDs from the ZSET (sorted by score/time)
  const orderIds = await kv.zrange('orders:list', 0, -1, { rev: true });
  
  const orders = [];
  
  if (orderIds && orderIds.length > 0) {
    // Fetch details for each order ID
    for (const id of orderIds) {
      const order = await kv.get(`order:${id}`);
      if (order) {
        orders.push(order as any);
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivered': return <PackageCheck className="w-4 h-4 text-emerald-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
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

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              Order Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage customer e-commerce orders.
            </p>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search order or customer..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>No orders found yet.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order.order_number} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{order.order_number}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-xs text-gray-500">{order.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-ID', { 
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link href={`/admin/orders/${order.order_number}`} className="flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
                          View Details
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
