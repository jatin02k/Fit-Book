'use client'

// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "@/app/components/ui/card";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import Link from "next/link";


interface TimeSlot {
    time: string; // e.g., "09:00 AM"
    isAvailable: boolean;
}

interface AvailabilitySelectorProps {
    serviceId: string;
    serviceName: string;
    durationMinutes: number; // Critical for Crux Logic API call
    price: number;
};

export function AvailabilitySelector({ serviceId, serviceName }: AvailabilitySelectorProps) {

    // DATE selection
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    // API results
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    // UI management
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // const router = useRouter();
    const to24Hour = (t: string) => {
    // expects like "09:00 AM" or "12:30 PM"
    const [time, meridiem] = t.split(' ');
    
    // Split the array destructuring:
    const timeParts = time.split(':').map(Number);
    let hh = timeParts[0]; // hh needs 'let' because it is reassigned
    const mm = timeParts[1]; // mm can be 'const' because it is never reassigned
    
    if (meridiem === 'PM' && hh !== 12) hh += 12;
    if (meridiem === 'AM' && hh === 12) hh = 0;
    
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};
      
      // inside your JSX, ensure selectedDate && selectedTime are set
      const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
      const timeParam = selectedTime ? to24Hour(selectedTime) : '';

    useEffect(() => {
        if (!selectedDate) {
            setTimeSlots([]);
            return;
        };
        const fetchAvailability = async () => {
            setIsLoading(true);
            setTimeSlots([]);
            setSelectedTime(null);


            const url = `/api/public/availability?serviceId=${serviceId}&date=${dateString}`

            try {
                const response = await fetch(url);
                const data = await response.json();

                // API returns fullTimeBlock as TimeSlot[]
                if (response.ok && data.fullTimeBlock) {
                    setTimeSlots(data.fullTimeBlock)
                } else {
                    // Handle API error/empty slots gracefully
                    setTimeSlots([]);
                    console.error("API Error:", data.error);
                }
            } catch (error) {
                console.error("Fetch failed:", error);
                setTimeSlots([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAvailability();
    }, [selectedDate, serviceId, dateString])

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-black">Choose Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>

                {/* Time Slots */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-black">Available Times</CardTitle>
                        {selectedDate && (
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
                        {!selectedDate ? (
                            <p className="text-gray-500 text-center py-8">
                                Please select a date first
                            </p>
                        ) : isLoading ? (
                            <p className="text-gray-500 text-center py-8">
                                Loading slots...
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3"> {/* Matches the 2-column Figma layout */}

                                {/* Handle case where no slots are returned at all (e.g., day is fully booked or closed) */}
                                {!isLoading && timeSlots.length === 0 ? (
                                    <p className="col-span-2 text-gray-500 text-center py-8">
                                        No slots are available for this date.
                                    </p>
                                ) : (
                                    // Render all time slots (available and unavailable)
                                    timeSlots.map((slot) => {
                                        const isSelected = selectedTime === slot.time;
                                        const baseClasses = "p-3 rounded-lg border text-sm transition-colors text-center font-medium";

                                        if (slot.isAvailable) {
                                            return (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => setSelectedTime(slot.time)}
                                                    className={`${baseClasses} 
                                ${isSelected
                                                            ? 'bg-black text-white border-black shadow-lg'
                                                            : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                                                        }
                            `}
                                                >
                                                    {slot.time}
                                                </button>
                                            );
                                        } else {
                                            return (
                                                // Render unavailable slot as a non-interactive div
                                                <div
                                                    key={slot.time}
                                                    className={`${baseClasses} bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed`}
                                                >
                                                    {slot.time}
                                                    <div className="text-xs mt-1 font-medium">Unavailable</div>
                                                </div>
                                            );
                                        }
                                    })
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
                {/* Summary */}
                {selectedDate && selectedTime && (
                    <Card className="mt-8 bg-white">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg text-black mb-1">Appointment Summary</h3>
                                    <p className="text-gray-600">
                                        {serviceName} on{' '}
                                        {selectedDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })} at {selectedTime}
                                    </p>
                                </div>
                                <Link
                                    href={`/checkout?serviceId=${serviceId}&date=${dateString}&time=${timeParam}`}
                                    className="ml-auto"
                                >
                                    <Button
                                        className="bg-black text-white hover:bg-gray-800"
                                        size="lg"
                                    >
                                        Continue to Booking
                                    </Button>
                                </Link>

                            </div>
                        </CardContent>
                    </Card>
                )}
        </div>
    )
}