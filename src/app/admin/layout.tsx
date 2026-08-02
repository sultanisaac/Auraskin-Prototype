import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../../index.css";
import Sidebar from "@/components/Sidebar";
import PinProtection from "@/components/PinProtection";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Admin AuraSkin",
  description: "Premium Medical Aesthetic Clinic Dashboard",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen bg-background text-text flex">
        <PinProtection>
          <Sidebar />
          {children}
        </PinProtection>
      </body>
    </html>
  );
}
