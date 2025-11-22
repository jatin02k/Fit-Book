import BusinessHoursForm from "@/app/components/BusinessHoursForm";
import ServiceOverview from "@/app/components/ServiceOverview";
import { createClient } from "@/lib/supabase/server";

// This is a Server Component, responsible for fetching initial data
async function getServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('id, name, duration_minutes, price');
  
  if (error) {
    console.error('Error fetching services on server:', error);
    // In a real app, handle this gracefully
    return []; 
  }
  return data;
}

// Fetch hours here too, to pass as a prop to BusinessHoursForm
async function getBusinessHours() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('business_hours')
    .select('day_of_week, open_time, close_time');
    
  if (error) {
    console.error('Error fetching hours on server:', error);
    return [];
  }
  return data;
}

export default async function ServiceAndHoursPage() {
  const initialServices = await getServices();
  const initialBusinessHours = await getBusinessHours();

  return (

    <div className="ml-64 p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl text-black mb-2">
            Service & Business <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-gray-600">Manage your services and business hours</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ServiceOverview initialServices={initialServices} />
        <BusinessHoursForm initialHours={initialBusinessHours} />
        </div>
      </div>
    </div>
  );
}