"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { useCartStore } from "@/store/cartStore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const clearCart = useCartStore(state => state.clearCart);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Clear cart after successful checkout
    if (orderNumber) {
      clearCart();
    }
  }, [orderNumber, clearCart]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pt-24">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-lg w-full text-center relative overflow-hidden">
        {/* Confetti-like decoration (simple) */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-yellow-400 to-primary"></div>
        
        <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for choosing Auraskin. Your glow-up journey starts now.
        </p>

        {orderNumber && (
          <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
            <p className="text-xl font-bold text-primary">{orderNumber}</p>
            <p className="text-xs text-gray-400 mt-2">
              We have sent the receipt and tracking information to your email.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/store" className="flex-1">
            <Button variant="primary" className="w-full py-3 rounded-xl flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <SuccessContent />
    </Suspense>
  );
}
