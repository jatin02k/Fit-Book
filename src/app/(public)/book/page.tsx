// Define the interfaces at the top of src/app/(public)/book/page.tsx
interface SearchParams {
    serviceId?: string;
}

// Define the simplest structure the compiler *should* accept
interface MinimalPageProps {
    searchParams?: SearchParams; // Make optional to match default Next.js behavior
}
// ------------------------------------------------------------------------

import { createClient } from "@/lib/supabase/server";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AvailabilitySelector } from '@/app/(public)/components/AvailabilitySelector'; // Client Component
import { Button } from "../components/ui/button";

export default async function SlotSelectionPage(
    // Use the simplest possible type for the prop object
    // You can even omit this annotation entirely if it causes issues, 
    // but MinimalPageProps should work.
    props: MinimalPageProps 
) {
    // FIX: Extract the searchParams property and cast it 
    // to the correct, non-Promise type using a local constant.
    const searchParams = props.searchParams as SearchParams | undefined;

    // Now proceed with your original logic, which is correctly typed
    const serviceId = searchParams?.serviceId ?? '';

    const supabase = await createClient();
    const { data: service, error } = await supabase
        .from('services')
        .select('id, name, duration_minutes, price')
        .eq('id', serviceId)
        .single();


    if (error || !service) {
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