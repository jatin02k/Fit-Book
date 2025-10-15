import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * The Root Page (/) serves as the main marketing/hero page for FitBook.
 * It directs users to the actual booking flow located at /services.
 * Note: This is a Server Component (default).
 */
export default async function HomePage() {
    return (
        // Full-screen container with minimal styling for a clean look
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-3xl w-full text-center py-20">
                
                {/* Brand and Tagline */}
                <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-4 tracking-tighter">
                    FitBook
                </h1>
                <p className="text-2xl text-indigo-600 font-semibold mb-6">
                    Simple, Reliable, 24/7 Appointment Scheduling.
                </p>

                {/* Value Proposition */}
                <p className="text-lg text-gray-700 mb-10 max-w-xl mx-auto">
                    Eliminate missed appointments and administrative overhead. Book your session instantly and securely with the power of Next.js and Supabase.
                </p>

                {/* Call to Action Button */}
                <Link
                    href="/services"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transition duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
                >
                    Book Your Session Now
                    <ArrowRight className="ml-3 h-6 w-6" />
                </Link>

                <div className="mt-16 text-gray-500 text-sm">
                    {/* Placeholder for future status or login links */}
                    <p>Designed for the Single-Vendor MVP (Minimum Viable Product)</p>
                </div>
            </div>
        </div>
    );
}