
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid'; 
import { ManualBookingForm } from "@/app/(public)/components/ManualBookingForm";
import { getBusinessHours, getServices } from "../services/page";

interface RawService {
    id: string; // Assuming database ID is string or needs simple cast
    name: string;
    price: number; // Database often returns numbers for currency
    duration_minutes: number;
    // Include all fields returned by getServices()
}

interface RawBusinessHour {
    id?: string; // May be optional/nullable depending on source
    day_of_week: number;
    open_time: string; // The raw field name
    close_time: string; // The raw field name
    // Include all fields returned by getBusinessHours()
}
// Define the structure for a single service item
export interface Service {
  id: string;
  name: string;
  price: string; // Assuming price is a formatted string (e.g., "$50.00")
  duration_minutes: number; 
}

// Define the structure for business hours
export interface BusinessHour {
  id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, etc.
  start_time: string; // e.g., "09:00"
  end_time: string;   // e.g., "17:00"
}

// Define the expected types for the server actions
// These are functions that take specific arguments and return Promises.
type CreateBookingAction = (formData: FormData) => Promise<{ success: boolean, cancellationUuid?: string }>;
type FetchSlotsAction = (serviceId: string, dateStr: string) => Promise<{ startTime: string; endTime: string }[]>;

// Define the props interface for the component
export interface ManualBookingFormProps {
  services: Service[];
  businessHours: BusinessHour[];
  createBookingAction: CreateBookingAction;
  fetchSlotsAction: FetchSlotsAction;
}

export async function fetchBookedSlots(serviceId: string, dateStr: string) {
    "use server";
    const supabase = await createClient();

    const dateStart = `${dateStr}T00:00:00.000`;
    const dateEnd = `${dateStr}T23:59:59.000`;
    
    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('start_time, end_time') 
        .eq('service_id', serviceId)
        .gte('start_time', dateStart) 
        .lte('start_time', dateEnd);  

    if (error) {
        console.error("Database error fetching booked slots:", error);
        throw new Error("Failed to retrieve booked times.");
    }
    
    return appointments.map(apt => ({
        startTime: apt.start_time,
        endTime: apt.end_time,
    }));
}


async function createManualBooking(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const serviceId = formData.get('serviceId') as string;
    const startTimeStr = formData.get('startTime') as string;
    const customerName = formData.get('customerName') as string;
    const customerEmail = formData.get('customerEmail') as string;
    const phoneNo = formData.get('phoneNo') as string;

    if (!serviceId || !startTimeStr || !customerName || !customerEmail) {
         throw new Error("Missing required form fields.");
    }
    
    const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('duration_minutes')
        .eq('id', serviceId)
        .single();

    if (serviceError || !service) {
        console.error("Service lookup error:", serviceError);
        throw new Error("Failed to retrieve service duration.");
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(startTime.getTime() + service.duration_minutes * 60000);
    
    const cancellationUuid = uuidv4(); 

    const newBooking = {
        service_id: serviceId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        customer_name: customerName,
        email: customerEmail,
        phone_number: phoneNo,
        status: 'confirmed',
        cancellation_link_uuid: cancellationUuid,
    };

    const { error: insertError } = await supabase
        .from('appointments')
        .insert(newBooking);

    if (insertError) {
        console.error("Database error creating manual booking:", insertError);
        throw new Error("Failed to create manual booking.");
    }

    revalidatePath('/admin/dashboard/appointments'); 
    return { success: true, cancellationUuid };
}

export default async function CreateBookingPage() {
    const rawServices = await getServices();
    const services: Service[] = rawServices.map((s: RawService) => ({
        id: s.id,
        name: s.name,
        price: String(s.price),
        duration_minutes: s.duration_minutes,
    }));

    const rawBusinessHours: RawBusinessHour[] = await getBusinessHours();
    
    // Fix 2: Map function argument is now typed as RawBusinessHour
    const businessHours: BusinessHour[] = rawBusinessHours.map((bh: RawBusinessHour) => ({
        // Use non-null assertion or type guard if bh.id is truly optional
        id: bh.id || `${bh.day_of_week}`, 
        day_of_week: bh.day_of_week,
        start_time: bh.open_time, // Map raw field to destination field
        end_time: bh.close_time,   // Map raw field to destination field
    }));

    return (
        <div className="p-8">
            <ManualBookingForm
                services={services} 
                businessHours={businessHours}
                createBookingAction={createManualBooking} 
                fetchSlotsAction={fetchBookedSlots}
            />
        </div>
    );
}