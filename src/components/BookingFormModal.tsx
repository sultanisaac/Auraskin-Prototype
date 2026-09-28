"use client";

import { useState, useTransition } from "react";
import { X, Calendar as CalendarIcon, Phone, User, Activity, Clock } from "lucide-react";
import { Booking, createBooking, updateBooking } from "@/actions/kv";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface BookingFormModalProps {
  initialData?: Partial<Booking> | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingFormModal({ initialData, onClose, onSuccess }: BookingFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<Partial<Booking>>({
    name: "",
    email: "",
    phone: "",
    treatment: "General Consultation",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "10:00",
    moreInfo: "",
    status: "confirmed",
    ...(initialData || {})
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (initialData?.id) {
        await updateBooking(initialData.id, formData);
      } else {
        await createBooking(formData);
      }
      onSuccess();
      onClose();
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-text/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-20 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center px-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-text"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-serif font-bold text-2xl text-primary">
              {initialData ? "Edit Appointment" : "Add Appointment"}
            </h3>
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-background border border-accent/20 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-background border border-accent/20 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-accent/20 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">Treatment *</label>
              <div className="relative">
                <Activity className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                <select
                  required
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-background border border-accent/20 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option value="Acne Treatment">Acne Treatment</option>
                  <option value="Brightening Program">Brightening Program</option>
                  <option value="Anti Aging">Anti Aging</option>
                  <option value="Laser Rejuvenation">Laser Rejuvenation</option>
                  <option value="Skin Booster">Skin Booster</option>
                  <option value="General Consultation">General Consultation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">Date *</label>
                <div className="relative">
                  <CalendarIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                  <input
                    required
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-background border border-accent/20 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">Time *</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                  <input
                    required
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 bg-background border border-accent/20 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-accent/20 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="declined">Declined</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">Notes</label>
              <textarea
                name="moreInfo"
                value={formData.moreInfo}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-background border border-accent/20 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="p-4 md:p-6 border-t border-accent/20 bg-background/50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium border border-accent/30 hover:bg-accent/10 transition-colors text-text"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="booking-form"
            disabled={isPending}
            className="px-6 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? "Saving..." : "Save Appointment"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
