import './globals.css'; // Global styles (Tailwind CSS imports here)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from './(public)/components/navigation';

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
        {/* Children is your actual page content (Service Selection Page) */}
        {children}
      </body>
    </html>
  );
}