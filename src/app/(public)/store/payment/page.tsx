import { kv } from '@vercel/kv';
import { notFound } from 'next/navigation';
import PaymentClient from './PaymentClient';

export default async function PaymentPage({ searchParams }: { searchParams: { order?: string } }) {
  const orderId = searchParams.order;
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
