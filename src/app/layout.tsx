import './globals.css'; // Global styles (Tailwind CSS imports here)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FitBook | Appointment Scheduling MVP',
  description: 'Single-vendor appointment booking system built with Next.js and Supabase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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