"use client";

import { useState } from "react";
import { CreditCard, Wallet, Smartphone, Building2 } from "lucide-react";
import { Button } from "@/components/Button";

interface PaymentClientProps {
  orderData: any;
}

const PAYMENT_METHODS = [
  { id: "BCA", name: "BCA Virtual Account", type: "VA", icon: <Building2 className="w-5 h-5" /> },
  { id: "BNI", name: "BNI Virtual Account", type: "VA", icon: <Building2 className="w-5 h-5" /> },
  { id: "MANDIRI", name: "Mandiri Virtual Account", type: "VA", icon: <Building2 className="w-5 h-5" /> },
  { id: "QRIS", name: "QRIS (GoPay, OVO, Dana, etc.)", type: "QRIS", icon: <Smartphone className="w-5 h-5" /> },
];

export default function PaymentClient({ orderData }: PaymentClientProps) {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleProcessPayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/store/process-custom-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderData.order_number,
          paymentMethod: selectedMethod.id,
          paymentType: selectedMethod.type
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process payment');

      setPaymentDetails(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentDetails) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
          <p className="text-gray-500 mb-8">Please complete the payment using the details below.</p>
          
          <div className="bg-gray-50 p-6 rounded-xl inline-block w-full max-w-md mb-8">
            <p className="text-sm font-semibold text-gray-500 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-primary mb-6">{formatPrice(orderData.total)}</p>
            
            {paymentDetails.type === 'VA' && (
              <>
                <p className="text-sm font-semibold text-gray-500 mb-1">{selectedMethod.name} Number</p>
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-center gap-4">
                  <span className="text-2xl font-mono tracking-wider text-gray-900">
                    {paymentDetails.account_number}
                  </span>
                </div>
              </>
            )}

            {paymentDetails.type === 'QRIS' && (
              <>
                <p className="text-sm font-semibold text-gray-500 mb-4">Scan QRIS to Pay</p>
                <div className="bg-white p-4 inline-block rounded-xl border border-gray-200">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentDetails.qr_string)}`} alt="QRIS" className="w-48 h-48 mx-auto" />
                </div>
              </>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-8">Once you have paid, the order status will update automatically.</p>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = `/store/success?order=${orderData.order_number}`}
            className="w-full sm:w-auto"
          >
            I have completed the payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Custom Payment Page</h1>
        <p className="text-gray-500 mt-2">Order {orderData.order_number}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Select Payment Method</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <div 
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${
                  selectedMethod.id === method.id 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/50' 
                    : 'border-gray-200 hover:border-primary/30'
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedMethod.id === method.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {method.icon}
                </div>
                <span className="font-semibold text-gray-900">{method.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span className="font-medium">{formatPrice(orderData.shipping_cost)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <span className="font-bold text-lg text-gray-900">Total</span>
                <span className="font-bold text-xl text-primary">{formatPrice(orderData.total)}</span>
              </div>
            </div>

            <Button 
              variant="primary" 
              onClick={handleProcessPayment}
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Proceed with {selectedMethod.id}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
