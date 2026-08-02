import '../../index.css';
import { Inter, Playfair_Display } from "next/font/google";
import { Layout } from '../../components/Layout';


const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: 'AuraSkin',
  description: 'Premium Skincare Clinic',
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
