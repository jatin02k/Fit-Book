import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FilteredDashboard } from "@/app/components/FilteredDashboard";

export default async function AppointmentsListPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: org } = await supabase
    .from("organizations")
    .select("id, slug, subscription_status")
    .eq("owner_id", user.id)
    .single();

  if (!org) return <div>Organization not found</div>;

  const isSubscribed = org.subscription_status === 'active';

  const { data: rawAppointments, error } = await supabase
    .from("appointments")
    .select(`
      id, start_time, end_time, customer_name, status, email, phone_number, service_id, cancellation_link_uuid,
      services (name, duration_minutes)
    `)
    .eq("organization_id", org.id)
    .order("start_time", { ascending: true });

  if (error) {
       console.error("Error fetching appointments:", error);
       return <div>Error loading appointments</div>;
  }

  // Transform data to match FilteredDashboardProps
  interface RawAppointment {
    id: string;
    customer_name: string;
    services: { name: string; duration_minutes: number }[] | { name: string; duration_minutes: number } | null;
    start_time: string;
    end_time: string;
    status: string;
    email: string;
    phone_number: string;
    service_id: string;
    cancellation_link_uuid: string;
  }

  const appointmentsInput = (rawAppointments || []).map((appt: RawAppointment) => ({
      id: appt.id,
      customerName: appt.customer_name || "Unknown",
      serviceName: Array.isArray(appt.services) ? appt.services[0]?.name : appt.services?.name || "General",
      date: new Date(appt.start_time).toLocaleDateString(), // Not strictly used by chart but good for debugging
      time: new Date(appt.start_time).toLocaleTimeString(),
      status: (appt.status as "pending" | "confirmed" | "upcoming") || "pending",
      start_time: appt.start_time, // Crucial for sorting/filtering
      end_time: appt.end_time,
      email: appt.email || "",
      phone_number: appt.phone_number || "",
      service_id: appt.service_id || "",
      cancellation_link_uuid: appt.cancellation_link_uuid || "",
      serviceDuration: String((Array.isArray(appt.services) ? appt.services[0]?.duration_minutes : appt.services?.duration_minutes) || 0)
  }));

  // Fetch services for the filter dropdown
  const { data: servicesData } = await supabase
    .from("services")
    .select("name")
    .eq("organization_id", org.id);

  const uniqueServices = Array.from(new Set(servicesData?.map(s => s.name) || []));

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-8 md:ml-64 mt-16 md:mt-0">
         {!isSubscribed && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
                <span className="font-bold">Subscription Inactive:</span>
                <span>You must be subscribed to view specific appointment details.</span>
            </div>
            <a href={`/app/${org.slug}/admin/dashboard/subscription`} className="text-sm font-semibold bg-red-100 hover:bg-red-200 px-4 py-2 rounded-md transition-colors">
                Subscribe Now
            </a>
          </div>
        )}
      </div>
              
        <div className={!isSubscribed ? 'opacity-30 pointer-events-none blur-[1px]' : ''}>
           <FilteredDashboard appointmentsList={appointmentsInput} services={uniqueServices} />
        </div>
    </div>
  );
}
