'use client'
import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";

// Define the Service interface based on its usage in the component
interface Service {
    id: string; 
    name: string; 
    price: string; 
    duration_minutes: number; 
}

export interface ManualBookingFormProps {
    services: Service[];
    businessHours: { start_time: string, end_time: string }[];
    createBookingAction: (formData: FormData) => Promise<{ success: boolean }>;
    fetchSlotsAction: (serviceId: string, dateString: string) => Promise<{ startTime: string }[]>;
}


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
        <div className="w-full">
      <div className="max-w-6xl mx-auto p-10 sm:mt-0 mt-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <UserPlus className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl text-black">Manual Booking</h1>
          </div>
          <p className="text-lg text-gray-600">
            Create walk-in appointments and manage bookings for customers
          </p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Booking created successfully! The appointment has been added to the calendar.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <Alert className="mb-6 border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Service & Time Selection */}
          <div className="space-y-6">
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
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - ₹{service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Choose Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Available Times</CardTitle>
                {selectedDate && selectedService && (
                  <p className="text-sm text-gray-600">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {!selectedDate || !selectedService ? (
                  <p className="text-gray-500 text-center py-8">
                    Please select a service and date first
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                    {timeSlots.map((time) => {
                      const available = isSlotAvailable(time);
                      return (
                        <button
                          key={time}
                          onClick={() => available && setSelectedTime(time)}
                          disabled={!available}
                          className={`p-2 rounded-lg border text-sm transition-colors ${
                            selectedTime === time
                              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-orange-500'
                              : available
                              ? 'bg-white text-black border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          {time}
                          {!available && (
                            <div className="text-xs mt-1">Booked</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customer Information */}
          <div className="space-y-6">
            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-black">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter customer's full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="border-gray-300 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="border-gray-300 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-black">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="border-gray-300 focus:border-orange-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            {selectedService && selectedDate && selectedTime && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-black">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Service:</span>
                    <span className="text-black">{selectedServiceData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Date:</span>
                    <span className="text-black">
                      {selectedDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Time:</span>
                    <span className="text-black">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between border-t border-orange-200 pt-3">
                    <span className="text-black">Total:</span>
                    <span className="text-xl text-black">{selectedServiceData?.price}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 py-6 text-lg"
              size="lg"
            >
              {isSubmitting ? 'Creating Booking...' : 'Create Manual Booking'}
            </Button>

            {/* Info Text */}
            <p className="text-sm text-gray-500 text-center">
              This booking will be added to the appointments calendar and prevent overlapping bookings
            </p>
          </div>
        </div>

        {/* Current Unavailable Slots Info */}
        {unavailableSlots.length > 0 && selectedDate && selectedService && (
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-800">
                <strong>Already Booked:</strong> {unavailableSlots.join(", ")} for {selectedServiceData?.name} on {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    );
}