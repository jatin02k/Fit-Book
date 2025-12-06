import BusinessHoursForm from "@/app/components/BusinessHoursForm";
import ServiceOverview from "@/app/components/ServiceOverview";
import { createClient } from "@/lib/supabase/server";

interface RawService {
  // The ID can be a number or a string that needs to be coerced.
  id: string | number;
  name: string | null | undefined;
  duration_minutes: number | string | null | undefined;
  price: number | string | null | undefined;
  description: string | null | undefined;
  // Features might be a string[], or null/undefined from the database
  features: string[] | null | undefined;
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number; // Ensuring price is number for math
  description: string;
  features: string[];
}
// This is a Server Component, responsible for fetching initial data
export async function getServices(): Promise<Service[]> {
    const supabase = await createClient();
    // FIX: Renamed destructured data variable from 'services' to 'rawServices' to avoid conflict
    const { data: rawServices, error } = await supabase
        .from('services')
        .select('id, name, duration_minutes, price, description, features'); // Select all necessary fields

    if (error) {
        console.error("Error fetching services:", error);
        return [];
    }

    // Handle case where rawServices might be null (though unlikely with Supabase client)
    if (!rawServices) {
        return [];
    }

    // FIX: Map the data to ensure no null values are passed to the client component
    const cleanServices: Service[] = rawServices.map((s: RawService) => ({
        id: String(s.id),
        name: s.name || 'Untitled Service',
        duration_minutes: Number(s.duration_minutes || 0),
        price: Number(s.price || 0),
        
        // FIX: Handle potential nulls and ensure correct type
        description: s.description || '', 
        // FIX: Handle potential nulls and ensure the type is always string[]
        features: (s.features && Array.isArray(s.features)) ? s.features : [], 
    }));

    return cleanServices;
}

// Fetch hours here too, to pass as a prop to BusinessHoursForm
export async function getBusinessHours() {
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