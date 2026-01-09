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
    .select("slug, id, name, phone, qr_code_url") 
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
      services (
        name,
        duration_minutes
      ),
      cancellation_link_uuid,
      status
    `)
    .eq("organization_id", org.id);

  if (error) {
    console.error("Error fetching appointments:", JSON.stringify(error, null, 2));
    // Handle error appropriately, maybe return an error message to the user
    return <div>Error loading appointments.</div>;
  }

  const appointments: Appointment[] = (rawAppointments || []).map((appt) => ({
    id: appt.id,
    start: appt.start_time,
    end: appt.end_time,
    customerName: appt.customer_name,
    // Safely access service details, handling array or single object response
    serviceName: Array.isArray(appt.services) ? appt.services[0]?.name : appt.services?.name,
    serviceDuration: Array.isArray(appt.services) ? appt.services[0]?.duration_minutes : appt.services?.duration_minutes,
    cancellationLink: appt.cancellation_link_uuid,
    // Explicitly cast status to the specific union type expected by Appointment
    status: (appt.status as Appointment["status"]) || "pending",
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-10 sm:px-10 lg:px-10">
            <h1 className="px-55 text-3xl font-bold leading-tight text-gray-900">
              Admin Dashboard for {org.name}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto">
            <div className="px-4 py-8 sm:px-0">
              
                <CalendarComponent appointments={appointments} />
              
            </div>
          </div>
        </main>

        <div className="max-w-4xl mx-auto px-16 md:px-16 pb-12">
           <BusinessDetailsForm 
              initialName={org.name || ""} 
              initialPhone={org.phone || ""} 
              initialQrCode={org.qr_code_url}
              orgId={org.id} 
           />
        </div>
      </div>
    </div>
  );
}
