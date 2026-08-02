import Header from "@/components/AdminHeader";
import { getBookings } from "@/actions/kv";
import PatientsClient from "@/components/PatientsClient";

export default async function PatientsPage() {
  const bookings = await getBookings();
  const pendingCount = bookings.filter(b => b.status === "pending").length;

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      <Header title="Patients" subtitle="Patient directory and medical history" pendingCount={pendingCount} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <PatientsClient bookings={bookings} />
      </div>
    </main>
  );
}
