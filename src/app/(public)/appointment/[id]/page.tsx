import { getBookings } from "@/actions/kv";
import AppointmentTrackerClient from "./AppointmentTrackerClient";
import Link from "next/link";
import { AlertCircle, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Appointment #${id.slice(0, 8).toUpperCase()} | AuraSkin Clinic`,
    description: "Track your AuraSkin medical aesthetic consultation status live.",
  };
}

export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookings = await getBookings();
  const booking = bookings.find(
    (b) => b.id.toLowerCase() === id.toLowerCase() || b.id.toLowerCase().startsWith(id.toLowerCase())
  );

  if (!booking) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-background">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-gray-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Appointment Not Found</h1>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            We could not find an appointment with ID <span className="font-mono font-semibold">#{id}</span>. Please verify the link or contact our clinic team.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/book-consultation"
              className="py-2.5 px-4 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-2xs"
            >
              Book a Consultation
            </Link>
            <Link
              href="/"
              className="py-2 px-4 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AppointmentTrackerClient booking={booking} />;
}

