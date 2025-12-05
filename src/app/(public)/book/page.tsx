import { createClient } from "@/lib/supabase/server";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AvailabilitySelector } from '@/app/(public)/components/AvailabilitySelector'; // Client Component
import { Button } from "../components/ui/button";

// --- FIX: Define local interfaces to override conflicting global types ---

interface SearchParams {
    serviceId?: string;
}

interface PageProps {
    searchParams: SearchParams;
}
// ------------------------------------------------------------------------

export default async function SlotSelectionPage({
    searchParams,
}: PageProps) { // <-- Component now uses the locally defined, correct PageProps
    const serviceId = searchParams?.serviceId ?? '';

    const supabase = await createClient();
    const { data: service, error } = await supabase
        .from('services')
        .select('id, name, duration_minutes, price')
        .eq('id', serviceId)
        .single();


    if (error || !service) {
        // You might want to ensure 'service' type is correct here, 
        // especially if the database returned a null or array.
        // Assuming your 'service' object contains id, name, etc.
        notFound();
    }

    return (
        <div className="min-h-screen pt-20 pb-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/services">
                        <Button
                            variant="outline"
                            className="mb-4 border-black text-black hover:bg-black hover:text-white"
                        >
                            ← Back to Services
                        </Button>
                    </Link>

                    <h1 className="text-3xl md:text-4xl text-black mb-2 tracking-tight">
                        Select Your Appointment
                    </h1>
                    <p className="text-xl text-gray-600">
                        Service: <span className="text-black">{service.name}</span>
                    </p>
                </div>

                
                    <AvailabilitySelector serviceId={serviceId} serviceName={service.name} durationMinutes={service.duration_minutes} price={service.price} />
                

               
            </div>
        </div>
    );
}