
import { ManualBookingForm } from "@/app/components/ManualBookingForm";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';
import { fetchBookedSlots } from "@/lib/fetchedBookedSlots";
import { redirect } from "next/navigation";

// Define the structure for a single service item
export interface Service {
  id: string;
  name: string;
  price: string;
  duration_minutes: number; 
}

// Define the structure for business hours
export interface BusinessHour {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

// -- Server Action --
async function createManualBooking(formData: FormData) {
    "use server";
    const supabase = await createClient();

    // 1. Secure Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // 2. Fetch Organization ID (Security Layer)
    const { data: org } = await supabase
        .from('organizations')
        .select('id, slug') // Fetch Slug too
        .eq('owner_id', user.id)
        .single();
    
    if (!org) throw new Error("Organization not found");

    const serviceId = formData.get('serviceId') as string;
    const startTimeStr = formData.get('startTime') as string;
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const phoneNo = formData.get('phoneNo') as string;

    if (!serviceId || !startTimeStr || !customerName || !customerEmail) {
         throw new Error("Missing required form fields.");
    }
    
    // 3. Validate Service belongs to Org
    const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('duration_minutes, organization_id')
        .eq('id', serviceId)
        .eq('organization_id', org.id) // Strict Check
        .single();

    if (serviceError || !service) {
        console.error("Service lookup error:", serviceError);
        throw new Error("Failed to retrieve service or access denied.");
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(startTime.getTime() + service.duration_minutes * 60000);
    
    const cancellationUuid = uuidv4(); 

    const newBooking = {
        service_id: serviceId,
        organization_id: org.id, // <--- CRITICAL FIX
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        customer_name: customerName,
        email: customerEmail,
        phone_number: phoneNo,
        status: 'confirmed', // Manual bookings are auto-confirmed
        cancellation_link_uuid: cancellationUuid,
        payment_url: null, // No payment proof for manual booking usually
        reminder_sent: false,
    };

    const { error: insertError } = await supabase
        .from('appointments')
        .insert(newBooking);

    if (insertError) {
        console.error("Database error creating manual booking:", insertError);
        throw new Error("Failed to create manual booking.");
    }

    // Revalidate the Path-Based Dashboard URL
    revalidatePath(`/app/${org.slug}/admin/dashboard`); 
    return { success: true, cancellationUuid };
}

export default async function CreateBookingPage() {
    const supabase = await createClient();

    // 1. Check Auth & Org
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");

    const { data: org } = await supabase
        .from("organizations")
        .select("id, slug, subscription_status")
        .eq("owner_id", user.id)
        .single();
    
    if (!org) return <div>Error: Organization not found</div>;

    const isSubscribed = org.subscription_status === 'active';

    // 2. Fetch Services (Secure)
    const { data: servicesRaw } = await supabase
        .from('services')
        .select('*')
        .eq('organization_id', org.id)
        .order("name", { ascending: true });
        
    const services: Service[] = (servicesRaw || []).map((s: { id: string; name: string; price: number; duration_minutes: number }) => ({
        id: s.id,
        name: s.name,
        price: String(s.price),
        duration_minutes: s.duration_minutes,
    }));

    // 3. Fetch Business Hours (Secure)
    const { data: businessHoursRaw } = await supabase
        .from('business_hours')
        .select('*')
        .eq('organization_id', org.id);

    const businessHours: BusinessHour[] = (businessHoursRaw || []).map((bh: { id: number; day_of_week: number; open_time: string; close_time: string }) => ({
        id: String(bh.id),
        day_of_week: bh.day_of_week,
        start_time: bh.open_time,
        end_time: bh.close_time, 
    }));

    return (

        <div className="min-h-screen bg-gray-50">
            <div className="ml-0 md:ml-64 transition-all duration-300 ease-in-out">
                <div className="max-w-6xl mx-auto">
                    {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">Manual Booking</h1> */}
                    
                    {!isSubscribed && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Subscription Inactive:</span>
                            <span>You must be subscribed to create manual bookings.</span>
                        </div>
                        <a href={`/app/${org.slug}/admin/dashboard/subscription`} className="text-sm font-semibold bg-red-100 hover:bg-red-200 px-4 py-2 rounded-md transition-colors whitespace-nowrap">
                            Subscribe Now
                        </a>
                    </div>
                    )}

                    <div className={`transition-opacity duration-200 ${!isSubscribed ? 'opacity-30 pointer-events-none blur-[1px]' : ''}`}>
                        <ManualBookingForm
                            services={services} 
                            businessHours={businessHours}
                            createBookingAction={createManualBooking} 
                            fetchSlotsAction={fetchBookedSlots}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}