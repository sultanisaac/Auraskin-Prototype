"use client";

import { Calendar, Users, CalendarDays, Bell, ShoppingBag, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-accent/30 hidden md:flex flex-col h-screen sticky top-0 shrink-0">
      <div className="h-20 flex items-center justify-between px-4 border-b border-accent/30 overflow-hidden">
        <div className="flex items-center shrink-0">
          <Image src="/logo.png" alt="AuraSkin Logo" width={32} height={32} className="mr-2 object-contain rounded-md shadow-sm" />
          <span className="font-serif font-bold text-lg text-primary tracking-wide">AuraSkin</span>
        </div>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2">
        <Link href="/admin" className={cn(
          "flex items-center px-4 py-3 rounded-md font-medium transition-colors",
          pathname === "/admin" || pathname === "/" ? "bg-primary/5 text-primary" : "text-text hover:bg-primary/5 hover:text-primary"
        )}>
          <Calendar className="h-5 w-5 mr-3" />
          Appointments
        </Link>
        <Link href="/admin/calendar" className={cn(
          "flex items-center px-4 py-3 rounded-md font-medium transition-colors",
          pathname === "/admin/calendar" ? "bg-primary/5 text-primary" : "text-text hover:bg-primary/5 hover:text-primary"
        )}>
          <CalendarDays className="h-5 w-5 mr-3" />
          Calendar
        </Link>
        <Link href="/admin/patients" className={cn(
          "flex items-center px-4 py-3 rounded-md font-medium transition-colors",
          pathname === "/admin/patients" ? "bg-primary/5 text-primary" : "text-text hover:bg-primary/5 hover:text-primary"
        )}>
          <Users className="h-5 w-5 mr-3" />
          Patients
        </Link>
        <Link href="/admin/notifications" className={cn(
          "flex items-center px-4 py-3 rounded-md font-medium transition-colors",
          pathname === "/admin/notifications" ? "bg-primary/5 text-primary" : "text-text hover:bg-primary/5 hover:text-primary"
        )}>
          <Bell className="h-5 w-5 mr-3" />
          Notifications
        </Link>
        <Link href="/admin/product" className={cn(
          "flex items-center px-4 py-3 rounded-md font-medium transition-colors",
          pathname === "/admin/product" ? "bg-primary/5 text-primary" : "text-text hover:bg-primary/5 hover:text-primary"
        )}>
          <ShoppingBag className="h-5 w-5 mr-3" />
          Products
        </Link>
      </nav>
      
      <div className="p-4 border-t border-accent/30 bg-gray-50/50">
        <a 
          href="https://auraskin-prototype.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center px-4 py-3 rounded-md font-medium text-text hover:bg-primary/5 hover:text-primary transition-colors border border-accent/20 bg-white shadow-sm w-full justify-center"
        >
          <Globe className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm">View Website</span>
        </a>
      </div>
    </aside>
  );
}
