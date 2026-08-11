"use client";

import { useCartStore } from "@/store/cartStore";
import { ArrowLeft, CreditCard, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const SHIPPING_OPTIONS = [
    { id: 'jne_reg', courier: 'JNE', service: 'REG', name: 'JNE Regular', est: '2-3 days', price: 25000 },
    { id: 'sicepat_reg', courier: 'SiCepat', service: 'REG', name: 'SiCepat REG', est: '2-3 days', price: 23000 },
    { id: 'anteraja_reg', courier: 'AnterAja', service: 'Reguler', name: 'AnterAja Reguler', est: '2-3 days', price: 22000 },
    { id: 'jnt_ez', courier: 'J&T', service: 'EZ', name: 'J&T EZ', est: '2-3 days', price: 24000 },
    { id: 'ninja_std', courier: 'Ninja Xpress', service: 'Standard', name: 'Ninja Standard', est: '2-3 days', price: 21000 },
    { id: 'id_express_std', courier: 'ID Express', service: 'Standard', name: 'ID Express Standard', est: '2-3 days', price: 20000 },
    { id: 'sap_reg', courier: 'SAP Express', service: 'Reguler', name: 'SAP Reguler', est: '2-3 days', price: 23500 },
    { id: 'lion_reg', courier: 'Lion Parcel', service: 'REGPACK', name: 'Lion Parcel REGPACK', est: '2-3 days', price: 24500 },
    { id: 'pos_kilat', courier: 'Pos Indonesia', service: 'Kilat Khusus', name: 'Pos Kilat Khusus', est: '2-4 days', price: 21000 },
    { id: 'tiki_reg', courier: 'TIKI', service: 'REG', name: 'TIKI Reguler', est: '2-3 days', price: 24000 },
    { id: 'wahana_normal', courier: 'Wahana', service: 'Normal', name: 'Wahana Tarif Normal', est: '3-5 days', price: 15000 },
    { id: 'paxel_sameday', courier: 'Paxel', service: 'SameDay', name: 'Paxel Same Day', est: 'Same day', price: 30000 },
    { id: 'gojek_sameday', courier: 'Gojek', service: 'SameDay', name: 'GoSend Same Day', est: 'Same day', price: 35000 },
    { id: 'grab_sameday', courier: 'Grab', service: 'SameDay', name: 'GrabExpress Same Day', est: 'Same day', price: 34000 },
    { id: 'lalamove_inst', courier: 'Lalamove', service: 'Instant', name: 'Lalamove Instant', est: 'Instant', price: 45000 },
  ];
  
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        items: items,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        address: {
          line: formData.address,
          city: formData.city,
          postal_code: formData.postalCode
        },
        shipping: {
          courier: selectedShipping.courier,
          service: selectedShipping.service,
          price: selectedShipping.price
        }
      };

      const res = await fetch('/api/store/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Redirect to Xendit
      if (data.invoice_url) {
        window.location.href = data.invoice_url;
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const shippingCost = selectedShipping.price;
  const finalTotal = getTotalPrice() + (items.length > 0 ? shippingCost : 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/store" className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Step 1: Contact Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Jane Doe" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="08123456789" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="jane@example.com" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address</label>
                  <textarea required name="address" value={formData.address} onChange={handleInputChange} placeholder="Jl. Sudirman No. 123, RT 01/02..." rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Jakarta Selatan" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Postal Code</label>
                    <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="12190" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Options */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                Shipping Method
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {SHIPPING_OPTIONS.map((option) => (
                  <div 
                    key={option.id}
                    onClick={() => setSelectedShipping(option)}
                    className={`p-4 border rounded-xl flex justify-between items-center cursor-pointer transition-colors ${
                      selectedShipping.id === option.id 
                        ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/50' 
                        : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className={`w-5 h-5 ${selectedShipping.id === option.id ? 'text-primary' : 'text-gray-400'}`} />
                      <div>
                        <p className={`font-bold ${selectedShipping.id === option.id ? 'text-gray-900' : 'text-gray-700'}`}>{option.name}</p>
                        <p className="text-xs text-gray-500">Estimated {option.est}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">{formatPrice(option.price)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {items.length === 0 ? (
                  <p className="text-gray-500 text-sm">Your cart is empty.</p>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                          {item.quantity}x
                        </span>
                        <span className="text-gray-700 line-clamp-1">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900 shrink-0 ml-2">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Shipping</span>
                  <span className="font-medium">{items.length > 0 ? formatPrice(shippingCost) : "Rp 0"}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-xl text-primary">{formatPrice(items.length > 0 ? finalTotal : 0)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                disabled={isLoading || items.length === 0}
                className="w-full mt-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay {formatPrice(items.length > 0 ? finalTotal : 0)}
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-gray-400 mt-4">Payments are secured and processed by Xendit.</p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
