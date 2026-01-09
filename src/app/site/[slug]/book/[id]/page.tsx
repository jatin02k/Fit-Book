import React from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilitySelector } from "@/app/components/AvailabilitySelector";
import { Button } from "@/app/components/ui/button";

interface BookingPageProps {
  params: Promise<{
    slug: string; // We get slug from the folder
    id: string;   // We get id from the folder
  }>;
}

export default async function SlotSelectionPage({ params }: BookingPageProps) {
  const { id } = await params; // Await params in Next 15
  
  const supabase = await createClient();
  const { data: service, error } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price")
    .eq("id", id)
    .single();

  if (error || !service) notFound();

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Helper Link: Middleware keeps us on the same subdomain */}
        <Link href="/services">
          <Button variant="outline" className="mb-4 border-black text-black hover:bg-black hover:text-white">
            ← Back to Services
          </Button>
        </Link>

        <h1 className="text-3xl md:text-4xl text-black mb-2">Select Your Appointment</h1>

        <p className="text-xl text-gray-600">
          Service: <span className="text-black">{service.name}</span>
        </p>

        <AvailabilitySelector
          serviceId={service.id}
          serviceName={service.name}
          durationMinutes={service.duration_minutes}
          price={service.price}
        />
      </div>
    </div>
  );
}