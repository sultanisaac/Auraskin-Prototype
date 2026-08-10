'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from './actions';

export function OrderStatusActions({ orderNumber, currentStatus }: { orderNumber: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!confirm(\`Are you sure you want to mark this order as \${newStatus.toUpperCase()}?\`)) return;
    
    setLoading(true);
    try {
      const res = await updateOrderStatus(orderNumber, newStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || 'Failed to update status');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {currentStatus === 'paid' && (
        <button 
          onClick={() => handleUpdateStatus('shipped')}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Mark as Shipped'}
        </button>
      )}
      
      {currentStatus === 'shipped' && (
        <button 
          onClick={() => handleUpdateStatus('delivered')}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Mark as Delivered'}
        </button>
      )}

      {(currentStatus === 'pending' || currentStatus === 'paid') && (
        <button 
          onClick={() => handleUpdateStatus('cancelled')}
          disabled={loading}
          className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
}
