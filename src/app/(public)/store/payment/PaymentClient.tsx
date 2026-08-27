"use client";

import { useState } from "react";
import { CreditCard, Wallet, Smartphone, Building2, Store, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/Button";

interface PaymentClientProps {
  orderData: any;
}

const PAYMENT_CATEGORIES = [
  {
    category: "Virtual Accounts",
    methods: [
      { id: "BCA", name: "BCA Virtual Account", type: "VA", icon: <Building2 className="w-5 h-5" /> },
      { id: "MANDIRI", name: "Mandiri Virtual Account", type: "VA", icon: <Building2 className="w-5 h-5" /> },
      { id: "BNI", name: "BNI Virtual Account", type: "VA", icon: <Building2 className="w-5 h-5" /> },
      { id: "BRI", name: "BRI Virtual Account", type: "VA", icon: <Building2 className="w-5 h-5" /> },
      { id: "PERMATA", name: "Permata Virtual Account", type: "VA", icon: <Building2 className="w-5 h-5" /> },
      { id: "BSI", name: "BSI Virtual Account", type: "VA", icon: <Building2 className="w-5 h-5" /> },
    ]
  },
  {
    category: "E-Wallets & QRIS",
    methods: [
      { id: "QRIS", name: "QRIS (All Banking & E-Wallets)", type: "QRIS", icon: <Smartphone className="w-5 h-5" /> },
      { id: "OVO", name: "OVO", type: "EWALLET", icon: <Wallet className="w-5 h-5" /> },
      { id: "DANA", name: "DANA", type: "EWALLET", icon: <Wallet className="w-5 h-5" /> },
      { id: "SHOPEEPAY", name: "ShopeePay", type: "EWALLET", icon: <Wallet className="w-5 h-5" /> },
    ]
  },
  {
    category: "Retail Outlets",
    methods: [
      { id: "ALFAMART", name: "Alfamart", type: "RETAIL", icon: <Store className="w-5 h-5" /> },
      { id: "INDOMARET", name: "Indomaret", type: "RETAIL", icon: <Store className="w-5 h-5" /> },
    ]
  },
  {
    category: "Credit / Debit Card",
    methods: [
      { id: "CREDIT_CARD", name: "Credit / Debit Card", type: "CARD", icon: <CreditCard className="w-5 h-5" /> },
    ]
  }
];

export default function PaymentClient({ orderData }: PaymentClientProps) {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_CATEGORIES[0].methods[0]);
  const [openCategory, setOpenCategory] = useState<string>("Virtual Accounts");
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

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(prev => prev === categoryName ? "" : categoryName);
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

            {paymentDetails.type === 'EWALLET' && (
              <>
                <p className="text-sm font-semibold text-gray-500 mb-4">Redirecting to {selectedMethod.name}</p>
                <Button variant="primary" onClick={() => window.open(paymentDetails.redirect_url, '_blank')} className="w-full">
                  Open {selectedMethod.name} App
                </Button>
              </>
            )}

            {paymentDetails.type === 'RETAIL' && (
              <>
                <p className="text-sm font-semibold text-gray-500 mb-1">{selectedMethod.name} Payment Code</p>
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-center gap-4">
                  <span className="text-2xl font-mono tracking-wider text-gray-900">
                    {paymentDetails.payment_code}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-4">Show this code to the cashier at {selectedMethod.name}</p>
              </>
            )}

            {paymentDetails.type === 'CARD' && (
              <>
                <p className="text-sm font-semibold text-gray-500 mb-4">Redirecting to Secure 3DS Authentication...</p>
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <Button 
                  variant="primary" 
                  onClick={async () => {
                    await fetch('/api/store/simulate-payment-success', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ orderNumber: orderData.order_number })
                    });
                    window.location.href = `/store/success?order=${orderData.order_number}`;
                  }} 
                  className="w-full"
                >
                  Simulate Success
                </Button>
              </>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-8">Once you have paid, the order status will update automatically.</p>
          
          <Button 
            variant="outline" 
            onClick={async () => {
              await fetch('/api/store/simulate-payment-success', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNumber: orderData.order_number })
              });
              window.location.href = `/store/success?order=${orderData.order_number}`;
            }}
            className="w-full sm:w-auto"
          >
            I have completed the payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Secure Checkout</h1>
        <p className="text-gray-500 mt-2">Order {orderData.order_number}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {PAYMENT_CATEGORIES.map((category) => {
              const isOpen = openCategory === category.category;
              return (
                <div key={category.category}>
                  <button 
                    onClick={() => toggleCategory(category.category)}
                    className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors focus:outline-none text-left"
                  >
                    <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  
                  {isOpen && (
                    <div className="p-6 pt-0 bg-white">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {category.methods.map((method) => (
                          <div key={method.id} className={method.id === 'CREDIT_CARD' ? 'sm:col-span-2' : ''}>
                            <div 
                              onClick={() => setSelectedMethod(method)}
                              className={`p-4 border rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${
                                selectedMethod.id === method.id 
                                  ? 'border-primary bg-primary/5 ring-1 ring-primary/50 shadow-sm' 
                                  : 'border-gray-200 hover:border-primary/30'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${selectedMethod.id === method.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {method.icon}
                              </div>
                              <span className={`font-semibold text-sm ${selectedMethod.id === method.id ? 'text-primary' : 'text-gray-700'}`}>
                                {method.name}
                              </span>
                            </div>

                            {/* Mock Credit Card Form */}
                            {method.id === 'CREDIT_CARD' && selectedMethod.id === 'CREDIT_CARD' && (
                              <div className="mt-3 p-5 border border-primary/20 rounded-xl bg-primary/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Card Number</label>
                                  <div className="relative">
                                    <input type="text" placeholder="0000 0000 0000 0000" maxLength={19} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-mono" />
                                    <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Expiry Date</label>
                                    <input type="text" placeholder="MM/YY" maxLength={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-mono" />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">CVV</label>
                                    <input type="password" placeholder="•••" maxLength={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-mono" />
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-2">
                                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                  Your card details are securely encrypted.
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
                  Pay with {selectedMethod.name}
                </>
              )}
            </Button>
            <p className="text-xs text-center text-gray-400 mt-4">Payments are secured and processed by Xendit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
