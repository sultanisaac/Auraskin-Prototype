import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';
import PaymentClient from './PaymentClient';

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.order;
  if (!orderId) {
    return notFound();
  }

  const orderData = await kv.get(`order:${orderId}`);
  if (!orderData) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <PaymentClient orderData={orderData} />
    </div>
  );
}
