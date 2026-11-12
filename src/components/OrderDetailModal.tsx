"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, PackageCheck, XCircle, X } from "lucide-react";

interface OrderDetailModalProps {
  order: any | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function OrderDetailModal({ order, onClose, onUpdate }: OrderDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isRequestingCourier, setIsRequestingCourier] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!order || !mounted) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const getStatusIcon = (status: string) => {
    if (!status) return <Clock className="w-3.5 h-3.5 text-gray-500" />;
    switch (status.toLowerCase()) {
      case "pending": return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
      case "paid": return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
      case "shipped": return <Truck className="w-3.5 h-3.5 text-blue-500" />;
      case "delivered": return <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case "cancelled": return <XCircle className="w-3.5 h-3.5 text-red-500" />;
      default: return <Clock className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) return "bg-gray-50 text-gray-700 border-gray-200";
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "paid": return "bg-green-50 text-green-700 border-green-200";
      case "shipped": return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const handleRequestCourier = async () => {
    setIsRequestingCourier(true);
    try {
      const { requestCourier } = await import("@/app/admin/orders/[id]/actions");
      const res = await requestCourier(order.order_number);
      if (res.success) {
        alert("Courier requested successfully!");
        if (onUpdate) onUpdate();
        onClose();
      } else {
        alert("Error requesting courier: " + res.error);
      }
    } catch (err) {
      alert("Failed to request courier. Please try again.");
    } finally {
      setIsRequestingCourier(false);
    }
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open(`/admin/orders/${order.order_number}/receipt`, "_blank");
    if (printWindow) printWindow.focus();
  };

  return createPortal(
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-gray-100/80"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gray-100 bg-gray-50/80">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900">Order Details</h3>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 font-mono break-all">#{order.order_number}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3 custom-scrollbar text-xs">
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50/90 p-2 sm:p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Status</span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border w-fit ${getStatusBadge(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : "Unknown"}</span>
                </span>
              </div>

              <div className="bg-gray-50/90 p-2 sm:p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Total Paid</span>
                <p className="font-bold text-primary text-xs sm:text-sm break-words leading-tight">
                  {formatPrice(order.total || order.totalAmount)}
                </p>
              </div>

              <div className="bg-gray-50/90 p-2 sm:p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Date</span>
                <p className="font-medium text-gray-700 text-[10px] sm:text-xs leading-tight break-words">
                  {order.paid_at || order.created_at ? new Date(order.paid_at || order.created_at).toLocaleDateString("en-ID", {
                    month: "short", day: "numeric", year: "numeric"
                  }) : "-"}
                </p>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-2xs space-y-2.5">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-1">Customer Information</span>
                <p className="font-bold text-gray-900 text-xs sm:text-sm break-words">{order.customer?.name || "Customer"}</p>
                <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-gray-600 text-[11px] sm:text-xs mt-0.5 break-all">
                  {order.customer?.phone && <span>{order.customer.phone}</span>}
                  {order.customer?.email && <span>{order.customer.email}</span>}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-0.5">Delivery Address</span>
                <p className="text-gray-800 break-words leading-relaxed text-xs">
                  {order.address?.line || "Address line not specified"}
                </p>
                <p className="text-gray-500 text-[11px] mt-0.5 break-words">
                  {[order.address?.city, order.address?.province, order.address?.postal_code].filter(Boolean).join(", ")}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-2 flex flex-wrap justify-between items-center gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Courier & Service</span>
                  <p className="font-medium text-gray-800 uppercase break-words text-xs">
                    {order.shipping?.courier || "Courier"} {order.shipping?.service || ""}
                  </p>
                </div>
                {order.shipping_cost > 0 && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Shipping Cost</span>
                    <p className="font-medium text-gray-800 text-xs">{formatPrice(order.shipping_cost)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Logistics (Biteship) if available */}
            {order.biteship_order_id && (
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 sm:p-3 text-xs space-y-1">
                <span className="text-[10px] text-blue-700 uppercase font-bold tracking-wider block">Biteship Logistics</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  <div className="min-w-0">
                    <p className="text-gray-500 text-[10px]">Order ID:</p>
                    <p className="font-mono text-[11px] sm:text-xs text-gray-900 break-all">{order.biteship_order_id}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 text-[10px]">Tracking ID / Resi:</p>
                    <p className="font-mono text-[11px] sm:text-xs font-bold text-blue-700 break-all">{order.tracking_id || order.waybill_id || "Pending Pickup"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Purchased Items - Full names, zero truncation */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                Purchased Items ({order.items?.length || 0})
              </span>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-gray-50/30">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="p-2 sm:p-2.5 flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Package className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm break-words leading-snug">{item.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-xs sm:text-sm shrink-0 whitespace-nowrap pt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-3 sm:p-3.5 border-t border-gray-100 bg-gray-50/80 flex flex-wrap justify-between items-center gap-2">
            <div className="flex flex-wrap gap-2">
              {order.status?.toLowerCase() === "paid" && !order.biteship_order_id && (
                <button 
                  onClick={handleRequestCourier}
                  disabled={isRequestingCourier}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isRequestingCourier ? "Requesting..." : "Request Courier"}
                </button>
              )}

              {order.status?.toLowerCase() === "paid" && order.biteship_order_id && (
                <button 
                  onClick={handlePrintReceipt}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Print Resi
                </button>
              )}
            </div>

            <button 
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ml-auto"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
