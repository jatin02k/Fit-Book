import './globals.css'; // Global styles (Tailwind CSS imports here)
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Appointor | Automate Booking for Coaches & Consultants',
  description: 'Stop managing appointments manually. The simple booking system for founders, indie devs, coaches, consultants, and freelancers. 14-day free trial.',
  keywords: ['booking software', 'appointment scheduling', 'booking system for coaches', 'scheduling software for consultants', 'indie dev tools', 'founder productivity', 'client booking', 'appointment booking for therapists'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <NextTopLoader
          color="#ec4899"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ec4899,0 0 5px #ec4899"
        />
        {/* Children is your actual page content (Service Selection Page) */}
        {children}
      </body>
    </html>
  );
}