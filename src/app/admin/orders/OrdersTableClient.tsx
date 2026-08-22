"use client";

import { useState, useEffect } from 'react';
import { Package, Search, Clock, CheckCircle, Truck, PackageCheck, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function OrdersTableClient({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price || 0);
  };

  const getStatusIcon = (status: string) => {
    if (!status) return <Clock className="w-4 h-4 text-gray-500" />;
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
    if (!status) return 'bg-gray-50 text-gray-700 border-gray-200';
    switch(status.toLowerCase()) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(order => 
    order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            Order Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage customer e-commerce orders.
          </p>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search order or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
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
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No orders found yet.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr 
                    key={order.order_number} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs md:text-sm font-medium text-gray-900">{order.order_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer?.name}</div>
                      <div className="text-xs text-gray-500">{order.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-ID', { 
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      }) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden sm:table-cell">
                      {formatPrice(order.total || order.totalAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {mounted && createPortal(
        <AnimatePresence>
        {selectedOrder && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div>
                  <h3 className="font-serif text-xl font-bold text-gray-900">Order Details</h3>
                  <p className="text-sm text-gray-500 mt-1">Order #{selectedOrder.order_number}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                
                {/* Summary Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status ? (selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)) : 'Unknown'}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString('en-ID', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total</p>
                    <p className="text-sm font-medium text-gray-900">{formatPrice(selectedOrder.total || selectedOrder.totalAmount)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Shipping</p>
                    <p className="text-sm font-medium text-gray-900 uppercase">{selectedOrder.shipping?.courier} {selectedOrder.shipping?.service}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Payment</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedOrder.payment_method ? selectedOrder.payment_method.replace(/_/g, ' ').toUpperCase() : '-'}
                      {selectedOrder.payment_channel ? ` (${selectedOrder.payment_channel.replace(/_/g, ' ').toUpperCase()})` : ''}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Customer Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Contact</p>
                      <p className="font-medium text-gray-900">{selectedOrder.customer?.name}</p>
                      <p className="text-gray-600">{selectedOrder.customer?.email}</p>
                      <p className="text-gray-600">{selectedOrder.customer?.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Shipping Address</p>
                      <p className="text-gray-900">{selectedOrder.address?.line}</p>
                      <p className="text-gray-600">{selectedOrder.address?.city}, {selectedOrder.address?.postal_code}</p>
                    </div>
                  </div>
                </div>

                {/* Logistics Info (if available) */}
                {selectedOrder.biteship_order_id && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Logistics (Biteship)</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Biteship Order ID</p>
                        <p className="font-medium text-gray-900">{selectedOrder.biteship_order_id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Tracking ID / Waybill</p>
                        <p className="font-medium text-gray-900">{selectedOrder.tracking_id || selectedOrder.waybill_id || 'Pending Pickup'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Payment Details</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Subtotal</p>
                      <p className="font-medium text-gray-900">{formatPrice((selectedOrder.total || selectedOrder.totalAmount) - (selectedOrder.shipping_cost || 0))}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Shipping Cost</p>
                      <p className="font-medium text-gray-900">{formatPrice(selectedOrder.shipping_cost || 0)}</p>
                    </div>
                    {selectedOrder.checkout_url && (
                      <div className="col-span-1 md:col-span-2 overflow-hidden w-full">
                        <p className="text-gray-500 mb-1">Payment Link</p>
                        <a href={selectedOrder.checkout_url} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate block w-full">
                          {selectedOrder.checkout_url}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between gap-3 items-center">
                {selectedOrder.status?.toLowerCase() === 'paid' ? (
                  <button 
                    onClick={() => {
                      const printWindow = window.open(`/admin/orders/${selectedOrder.order_number}/receipt`, '_blank');
                      if (printWindow) printWindow.focus();
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Printable Receipt
                  </button>
                ) : <div />}
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  );
}
