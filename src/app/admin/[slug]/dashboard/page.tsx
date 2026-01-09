import { createClient } from "@/lib/supabase/server";
import { CalendarComponent } from "@/app/components/calendarComponent";
import { redirect } from "next/navigation";
import { BusinessDetailsForm } from "@/app/components/dashboard/BusinessDetailsForm";

export const dynamic = "force-dynamic";

export interface Appointment {
  id: string;
  start: string;
  end: string;
  customerName: string;
  serviceName: string;
  serviceDuration: number;
  cancellationLink: string;
  status: "pending" | "confirmed" | "upcoming";
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
     redirect("/admin/login");
  }

  // 2. Get User's Organization
  const { data: org } = await supabase
    .from("organizations")
    .select("slug, id, name, phone") 
    .eq("owner_id", user.id)
    .single();

  if (!org) {
     return <div>Error: No Organization found for this user.</div>;
  }

  // 3. Fetch Appointments securely
  // Explicitly Filter by Org ID
  const { data: rawAppointments, error } = await supabase
    .from("appointments")
    .select(`
      id,
      start_time,
      end_time,
      customer_name,
      cancellation_link_uuid,
      status,
      services (
        name,
        duration_minutes
      )
    `)
    .eq("organization_id", org.id)
    .order("start_time", { ascending: true });

  // Correct URL generation for Path-Based Tenancy
  // Since we are Server Component, we can't use window.location. But for display we can just show the relative path or construct best guess.
  // Actually, for "Your Public Booking Link", a relative path is clickable. 
  // If we want full URL:
  // We can try to get host from headers, or just use a relative path like `/gym/${org.slug}`
  
  const publicLink = org ? `/gym/${org.slug}` : "#"; // Relative path is safest and works everywhere

  if (error) {
    console.error("Dashboard Fetch Error:", error);
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl text-red-600">Error loading data</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  // 3. Map to Interface
  interface RawAppointment {
    id: string;
    start_time: string;
    end_time: string;
    customer_name: string;
    cancellation_link_uuid: string;
    status: string;
    services: { name: string; duration_minutes: number }[] | { name: string; duration_minutes: number } | null;
  }

  const appointments: Appointment[] = (rawAppointments || []).map((appt: RawAppointment) => {
    // Handle the joined data safely
    const serviceData = Array.isArray(appt.services) ? appt.services[0] : appt.services;
    
    return {
      id: appt.id,
      start: appt.start_time,
      end: appt.end_time,
      customerName: appt.customer_name,
      serviceName: serviceData?.name || "Unknown Service",
      serviceDuration: serviceData?.duration_minutes || 60,
      cancellationLink: `/admin/cancel/${appt.cancellation_link_uuid}`,
      status: (appt.status as "pending" | "confirmed" | "upcoming") || "pending",
    };
  });

  console.log("appointments length", appointments.length);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="md:ml-64 p-4 md:p-8 mt-16 md:mt-0">
        <div className="mb-8 flex justify-between items-end">
           <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">Welcome back, here is what is happening today.</p>
           </div>
           {org && (
               <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex items-center gap-3">
                  <div className="text-sm text-indigo-800">
                     <p className="font-semibold">Your Public Booking Link:</p>
                     <a href={publicLink} target="_blank" className="hover:underline text-indigo-600 break-all">
                        {publicLink}
                     </a>
                  </div>
               </div>
           )}
        </div>
      </div>
      <div className="flex-1 space-y-8">
        <CalendarComponent appointments={appointments} />
        
        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12">
           <BusinessDetailsForm 
              initialName={org.name || ""} 
              initialPhone={org.phone || ""} 
              orgId={org.id} 
           />
        </div>
      </div>
    </div>
  );
}
