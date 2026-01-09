import { createClient } from "@/lib/supabase/server";
import ServiceOverview from "@/app/components/ServiceOverview";
import BusinessHoursForm from "@/app/components/BusinessHoursForm";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const supabase = await createClient();

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  // 2. Get User's Organization
  const { data: org } = await supabase
    .from("organizations")
    .select("id") // Fetch ID
    .eq("owner_id", user.id)
    .single();

  if (!org) {
     return <div>Error: No Organization found for this user.</div>;
  }

  // 3. Fetch Services & Business Hours (Parallel)
  console.log("Fetching services and hours for Org ID:", org.id);

  const [servicesResult, hoursResult] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("organization_id", org.id)
      .order("id", { ascending: false }),
    supabase
      .from("business_hours")
      .select("*")
      .eq("organization_id", org.id) // Assuming column exists
      .order("day_of_week", { ascending: true })
  ]);

  const { data: services, error: servicesError } = servicesResult;
  const { data: hours, error: hoursError } = hoursResult;

  if (servicesError || hoursError) {
    console.error("Failed to fetch data. Org ID:", org.id);
    if(servicesError) console.error("Services Error:", JSON.stringify(servicesError, null, 2));
    if(hoursError) console.error("Hours Error:", JSON.stringify(hoursError, null, 2));
    
    return (
      <div className="p-4 text-red-500">
        <h3 className="font-bold">Error loading dashboard data</h3>
        <p>Organization ID: {org.id}</p>
        {servicesError && (
             <div className="mt-2">
                <strong>Services Error:</strong>
                <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(servicesError, null, 2)}</pre>
             </div>
        )}
        {hoursError && (
             <div className="mt-2">
                <strong>Hours Error:</strong>
                <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(hoursError, null, 2)}</pre>
             </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 md:ml-64 mt-16 md:mt-0 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Management</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ServiceOverview initialServices={services || []} />
            <BusinessHoursForm initialHours={hours || []} />
        </div>
      </div>
    </div>
  );
}
