import Header from "@/components/AdminHeader";
import { getBookings } from "@/actions/kv";
import { format, parseISO } from "date-fns";
import AppointmentsTable from "@/components/AppointmentsTable";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  let bookings = await getBookings();

  if (params?.search) {
    const query = params.search.toLowerCase();
    bookings = bookings.filter(b => 
      b.name.toLowerCase().includes(query) || 
      b.treatment.toLowerCase().includes(query) ||
      (b.email && b.email.toLowerCase().includes(query)) ||
      b.phone.includes(query)
    );
  }

  // Define sorted bookings
  const sortedBookings = bookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pendingCount = bookings.filter(b => b.status === "pending").length;

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header title="Appointments" subtitle="View and manage all upcoming appointments" pendingCount={pendingCount} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <AppointmentsTable bookings={sortedBookings} />
      </div>
    </main>
  );
}
