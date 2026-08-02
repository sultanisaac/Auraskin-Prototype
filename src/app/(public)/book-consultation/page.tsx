import { Suspense } from 'react';
import BookingPage from '@/pages/BookingPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-24 text-center">Loading booking form...</div>}>
      <BookingPage />
    </Suspense>
  );
}
