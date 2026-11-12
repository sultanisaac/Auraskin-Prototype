// WhatsApp utility for phone sanitization and pre-filled clinic message generation

export const APP_BASE_URL = "https://auraskin-prototype.vercel.app";

/**
 * Sanitizes and formats phone numbers for WhatsApp wa.me links.
 * Handles Indonesian numbers (08... -> 628...) and foreign numbers.
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}

export interface BookingWhatsAppInfo {
  name: string;
  phone: string;
  treatment: string;
  date: string;
  time: string;
  status: string;
  id?: string;
  cancelReason?: string;
}

/**
 * Generates an appropriate pre-filled clinic WhatsApp message URL
 * based on the booking's current status and includes the live tracking link.
 */
export function getWhatsAppBookingUrl(booking: BookingWhatsAppInfo): string {
  const phone = formatWhatsAppNumber(booking.phone);
  if (!phone) return "#";

  const trackingLink = booking.id ? `${APP_BASE_URL}/appointment/${booking.id}` : "";
  let message = "";

  if (booking.status === "confirmed") {
    message = `Halo Kak ${booking.name}! ✨\n\nReservasi konsultasi Anda di *AuraSkin Clinic* telah kami *TERKONFIRMASI*:\n\n💆‍♀️ *Treatment:* ${booking.treatment}\n🗓️ *Tanggal:* ${booking.date}\n⏰ *Waktu:* ${booking.time} WIB\n\n📍 *Lokasi:* AuraSkin Aesthetic Clinic, Grand Indonesia Mall Level 3, Jakarta Pusat.${
      trackingLink ? `\n\n🔗 *Lihat detail & status live reservasi Anda di sini:*\n${trackingLink}` : ""
    }\n\nMohon hadir 10–15 menit sebelum jadwal ya Kak.\n\nSampai jumpa di AuraSkin! 🌸`;
  } else if (booking.status === "declined") {
    message = `Halo Kak ${booking.name},\n\nTerima kasih telah menghubungi AuraSkin Clinic. Terkait permintaan reservasi treatment *${booking.treatment}* pada ${booking.date} pukul ${booking.time}, mohon maaf slot dokter pada waktu tersebut sedang penuh/tidak tersedia${booking.cancelReason ? ` (${booking.cancelReason})` : ""}.${
      trackingLink ? `\n\n🔗 *Status reservasi Anda:*\n${trackingLink}` : ""
    }\n\nApakah Kak ${booking.name} berkenan untuk kami jadwalkan ulang ke hari atau jam lainnya? Kami siap membantu mencarikan jadwal terbaik untuk Kakak. 🙏`;
  } else if (booking.status === "cancelled") {
    message = `Halo Kak ${booking.name},\n\nReservasi Anda di AuraSkin Clinic untuk treatment *${booking.treatment}* pada ${booking.date} pukul ${booking.time} telah dibatalkan${booking.cancelReason ? ` (${booking.cancelReason})` : ""}.${
      trackingLink ? `\n\n🔗 *Detail reservasi Anda:*\n${trackingLink}` : ""
    }\n\nJika Kakak ingin melakukan reservasi kembali di lain waktu, silakan hubungi kami kapan saja. Terima kasih! 🌸`;
  } else {
    // Pending status
    message = `Halo Kak ${booking.name}! ✨\n\nTerima kasih telah melakukan reservasi konsultasi di *AuraSkin Clinic* untuk treatment *${booking.treatment}* pada ${booking.date} pukul ${booking.time}.\n\nPermintaan reservasi Kakak sedang kami proses dan review oleh tim dokter kami.${
      trackingLink ? `\n\n🔗 *Cek status live reservasi Kakak di sini:*\n${trackingLink}` : ""
    }\n\nSampai jumpa di AuraSkin! 🌸`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a direct WhatsApp link for patient to message the clinic directly.
 */
export function getClinicWhatsAppUrl(bookingId?: string, patientName?: string): string {
  // Clinic contact WhatsApp number (AuraSkin Official)
  const clinicPhone = "6281273315620";
  let message = "Halo AuraSkin Clinic! ✨ Saya ingin berkonsultasi seputar treatment kecantikan.";
  if (bookingId) {
    message = `Halo AuraSkin Clinic! ✨ Saya ingin menanyakan reservasi konsultasi saya (ID: #${bookingId.slice(0, 8).toUpperCase()}${patientName ? ` atas nama ${patientName}` : ""}).`;
  }
  return `https://wa.me/${clinicPhone}?text=${encodeURIComponent(message)}`;
}
