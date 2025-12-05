'use client'
import { useState, useMemo, useEffect, useCallback } from "react";
import { ManualBookingFormProps } from "../../admin/dashboard/bookings/page";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Define the Service interface based on its usage in the component
interface Service {
    id: string; 
    name: string; 
    price: string; 
    duration_minutes: number; 
}

// Assuming your ManualBookingFormProps looks like this (or update the interface above if needed)
// export interface ManualBookingFormProps {
//     services: Service[];
//     businessHours: { start_time: string, end_time: string }[];
//     createBookingAction: (formData: FormData) => Promise<{ success: boolean }>;
//     fetchSlotsAction: (serviceId: string, dateString: string) => Promise<{ startTime: string }[]>;
// }


// Helper function to generate time slots based on business hours
const generateTimeSlots = (start: string, end: string, interval: number): string[] => {
    const slots: string[] = [];
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    let currentTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    while (currentTime < endTime) {
        const hour = Math.floor(currentTime / 60) % 24;
        const minute = currentTime % 60;
        
        // Format time as HH:MM
        slots.push(
            `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
        );
        currentTime += interval;
    }
    return slots;
};


export function ManualBookingForm({ services, businessHours, createBookingAction, fetchSlotsAction }:ManualBookingFormProps) {
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [bookedSlots, setBookedSlots] = useState<string[]>([]); 
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // FIX 1: Explicitly type selectedServiceData as Service | undefined
    const selectedServiceData: Service | undefined = services.find((s: Service) => s.id === selectedService);
    
    // Determine the interval (e.g., 30 mins) - default to service duration
    const interval = selectedServiceData ? selectedServiceData.duration_minutes : 30;
    
    // Calculate the time slots based on business hours and interval
    const timeSlots = useMemo(() => {
        if (!businessHours || businessHours.length === 0) return [];
        
        const hours = businessHours[0]; 
        
        return generateTimeSlots(hours.start_time, hours.end_time, interval);
    }, [businessHours, interval]);
    
    // Fetch booked slots whenever the date or service changes
    const loadBookedSlots = useCallback(async () => {
        if (!selectedDate || !selectedService) {
            setBookedSlots([]);
            return;
        }

        setIsLoadingSlots(true);
        setErrorMessage("");
        
        try {
            const dateString = selectedDate.toISOString().split('T')[0];
            // fetchSlotsAction is typed to return { startTime: string }[] in ManualBookingFormProps
            const bookedData: { startTime: string }[] = await fetchSlotsAction(selectedService, dateString);
            
            // FIX 2: map function argument is correctly typed here
            const bookedTimes = bookedData.map((apt: { startTime: string }) => {
                const date = new Date(apt.startTime);
                return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            });

            setBookedSlots(bookedTimes);
        } catch (error) {
            console.error("Failed to fetch slots:", error);
            setErrorMessage("Failed to load available slots.");
        } finally {
            setIsLoadingSlots(false);
        }
    }, [selectedDate, selectedService, fetchSlotsAction]);

    useEffect(() => {
        loadBookedSlots();
    }, [loadBookedSlots]);

    // Check if a time slot is available (overlap detection simplified for fixed slots)
    // Note: For real overlap detection considering service duration, the backend is safer.
    const isSlotAvailable = (time: string): boolean => {
        return !bookedSlots.includes(time);
    };

    // Get unavailable slots for the selected date and service
    const getUnavailableSlots = (): string[] => {
        return bookedSlots;
    };

    const isFormValid = (): boolean => {
        return !!(
            selectedService &&
            selectedDate &&
            selectedTime &&
            customerName.trim() &&
            customerEmail.trim() &&
            customerPhone.trim() &&
            customerEmail.includes('@')
        );
    };

   const handleSubmit = async () => {
        if (!isFormValid()) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        // Double-check availability before submitting using the fetched data
        if (!isSlotAvailable(selectedTime)) {
            setErrorMessage("This time slot is no longer available. Please select another time.");
            return;
        }
        
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            // ... (Timezone logic remains the same)

            // 1. Get the local components of the selected date (Year, Month, Day)
            const date = selectedDate!;
            
            // 2. Get the time components (Hour, Minute) from selectedTime (e.g., "18:00")
            const [hour, minute] = selectedTime.split(':').map(Number);
            
            // 3. Create a NEW Date object set to the local date and the local time.
            const localStartDate = new Date(
                date.getFullYear(), 
                date.getMonth(), 
                date.getDate(), 
                hour, 
                minute, 
                0
            );

            // 4. Convert this local date/time to an ISO string. 
            const startTimeStr = localStartDate.toISOString(); 

            // Use the passed server action to create the booking
            const formData = new FormData();
            formData.append('serviceId', selectedService);
            formData.append('startTime', startTimeStr); 
            formData.append('customerName', customerName);
            formData.append('customerEmail', customerEmail);
            formData.append('phoneNo', customerPhone);

            const result = await createBookingAction(formData);

            if (result.success) {
                 // Show success message
                setShowSuccess(true);
                // Immediately refresh the booked slots for the new booking
                loadBookedSlots(); 

                // Reset form after a delay
                setTimeout(() => {
                    setSelectedService("");
                    setSelectedDate(new Date());
                    setSelectedTime("");
                    setCustomerName("");
                    setCustomerEmail("");
                    setCustomerPhone("");
                    setShowSuccess(false);
                }, 3000);
            } else {
                 setErrorMessage("Failed to create booking.");
            }
           

        // FIX 4: Use unknown and type guard for catching errors
        } catch (error: unknown) {
            let errorMessageText = "Failed to create booking. Please try again.";
    
            if (error instanceof Error) {
                errorMessageText = error.message;
            }
    
            setErrorMessage(errorMessageText);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const unavailableSlots = getUnavailableSlots();

    return (
        <div className="ml-64 min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header, Alerts, and other JSX */}
                {/* ... */}
                        {/* Service Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-black">Select Service</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Select value={selectedService} onValueChange={setSelectedService}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose a service..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* FIX 3: Replace (service:any) with Service */}
                                        {services.map((service: Service) => (
                                            <SelectItem key={service.id} value={service.id}>
                                                {service.name} - {service.price}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                {/* ... (rest of the JSX) */}
            </div>
        </div>
    );
}