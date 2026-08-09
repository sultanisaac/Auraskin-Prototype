import '../../index.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from "next/font/google";
import { Layout } from '../../components/Layout';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL('https://auraskin-prototype.vercel.app/'),
  title: 'AuraSkin | Premium Skincare Clinic',
  description: 'AuraSkin is a premium skincare clinic providing advanced treatments and expert care for radiant, healthy skin.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'AuraSkin | Premium Skincare Clinic',
    description: 'AuraSkin is a premium skincare clinic providing advanced treatments and expert care for radiant, healthy skin.',
    url: 'https://auraskin-prototype.vercel.app/',
    siteName: 'AuraSkin',
    images: [
      {
        url: '/Home page/hero-section.png',
        width: 1200,
        height: 630,
        alt: 'AuraSkin - Premium Skincare Treatments',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuraSkin | Premium Skincare Clinic',
    description: 'AuraSkin is a premium skincare clinic providing advanced treatments and expert care for radiant, healthy skin.',
    images: ['/Home page/hero-section.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="font-sans text-text antialiased">

        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
