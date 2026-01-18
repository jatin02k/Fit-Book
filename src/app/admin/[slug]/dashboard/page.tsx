import { createClient } from "@/lib/supabase/server";
import { CalendarComponent } from "@/app/components/calendarComponent";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";

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
        duration_minutes,
        price
      ),
      cancellation_link_uuid,
      status
    `)
    .eq("organization_id", org.id);

  // 4. Fetch Services for Checklist & Revenue Calc
  // We need to check for BOTH added services (>3) AND edited services (updated > created)
  const { data: services } = await supabase
    .from("services")
    .select("created_at, updated_at")
    .eq("organization_id", org.id);

  const servicesCount = services?.length || 0;

  if (error) {
    console.error("Error fetching appointments:", JSON.stringify(error, null, 2));
    return <div>Error loading appointments.</div>;
  }

  const appointments: Appointment[] = (rawAppointments || []).map((appt) => ({
    id: appt.id,
    start: appt.start_time,
    end: appt.end_time,
    customerName: appt.customer_name,
    serviceName: Array.isArray(appt.services) ? appt.services[0]?.name : appt.services?.name,
    serviceDuration: Array.isArray(appt.services) ? appt.services[0]?.duration_minutes : appt.services?.duration_minutes,
    cancellationLink: appt.cancellation_link_uuid,
    status: (appt.status as Appointment["status"]) || "pending",
  }));

  // --- METRICS CALCULATION ---
  const validAppts = rawAppointments || [];
  
  // Time Saved: 10 mins per booking
  const timeSavedMinutes = validAppts.length * 10;
  const timeSavedHours = (timeSavedMinutes / 60).toFixed(1).replace('.0', ''); // e.g. "2" or "2.5"

  // Revenue: Sum of prices for "confirmed" appointments
  // Seeded ones are confirmed.
  const revenueCollected = validAppts
    .filter(a => a.status === 'confirmed')
    .reduce((sum, appt) => {
        const s = Array.isArray(appt.services) ? appt.services[0] : appt.services;
        const price = s?.price || 0;
        return sum + price;
    }, 0);

  // --- CHECKLIST STATE PREP ---
  // 1. Edit services
  // Check if user has added/removed services (count != 3) or edited existing ones
  const isServicesEdited = (servicesCount !== 3) || (services?.some(s => {
      const created = new Date(s.created_at).getTime();
      const updated = s.updated_at ? new Date(s.updated_at).getTime() : created;
      return updated - created > 1000; 
  }) ?? false);

  // 2. Real Bookings (Share link check fallback)
  const hasRealBookings = validAppts.length > 3;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-8 ml-64">
        
        <DashboardHeader 
            org={org}
            timeSavedMinutes={timeSavedMinutes}
            timeSavedHours={timeSavedHours}
            revenueCollected={revenueCollected}
            hasRealBookings={hasRealBookings}
            isServicesEdited={isServicesEdited}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             {/* The CalendarComponent handles its own layout and container centering */}
             <CalendarComponent appointments={appointments} />
      </main>
    </div>
  );
}
