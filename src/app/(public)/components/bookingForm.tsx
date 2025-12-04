'use client'

import { bookingSchema } from "@/lib/validation/bookingSchema";
import { useCallback, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Bounce, toast, ToastContainer } from "react-toastify";
import z from "zod";
import { Loader2 } from "lucide-react";


type BookingFormProps = {
    serviceId: string;
    serviceName: string;
    date: string;        // YYYY-MM-DD
    time: string;        // HH:mm (24h)
};
export default function BookingForm({
    serviceId,
    serviceName,
    date,
    time,
}: BookingFormProps) {
    const [formData, setFormData] = useState({
        'name': '',
        'email': '',
        'phoneNo': ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; phoneNo?: string }>({});

    const clientSchema = useMemo(() => z.object({
        name: bookingSchema.shape.name,
        email: bookingSchema.shape.email,
        phoneNo: bookingSchema.shape.phoneNo.optional(),
    }), []);

    const validateField = useCallback((field: keyof typeof formData, value: string) => {
        try {
            clientSchema.pick({ [field]: true } as any).parse({ [field]: value });
            setErrors(prev => ({ ...prev, [field]: undefined }));
        } catch (e) {
            if (e instanceof z.ZodError) {
                const message = e.issues[0]?.message || "Invalid value";
                setErrors(prev => ({ ...prev, [field]: message }));
            }
        }
    }, [clientSchema]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        validateField(field as keyof typeof formData, value);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const start = new Date(`${date}T${time}`);

        setIsSubmitting(true);
        const { name, email, phoneNo } = formData;
        try {
            // Client-side validation for better UX
            const clientValidation = clientSchema.safeParse({ name, email, phoneNo });
            if (!clientValidation.success) {
                const fieldErrors: Record<string, string> = {};
                for (const issue of clientValidation.error.issues) {
                    const key = String(issue.path[0]);
                    fieldErrors[key] = issue.message;
                }
                setErrors(fieldErrors);
                setIsSubmitting(false);
                return;
            }

            // Build payload expected by API
            const payload = {
                serviceId,
                startTime: start.toISOString(),
                name,
                email,
                phoneNo: phoneNo || undefined,
            };

            // Validate payload before sending (guards against malformed params)
            const parsed = bookingSchema.safeParse(payload);
            if (!parsed.success) {
                const fieldErrors: Record<string, string> = {};
                for (const issue of parsed.error.issues) {
                    const key = String(issue.path[0]);
                    if (key in formData) fieldErrors[key] = issue.message;
                }
                setErrors(fieldErrors);
                setIsSubmitting(false);
                return;
            }

            const res = await fetch('/api/public/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (res.status === 400 && data?.details) {
                    const fieldErrors: Record<string, string> = {};
                    for (const d of data.details) {
                        if (d?.path) fieldErrors[d.path] = d.message;
                    }
                    setErrors(fieldErrors);
                    toast.error('Please correct the highlighted fields.', { position: "top-right", autoClose: 4000, theme: "dark", transition: Bounce });
                } else if (res.status === 409) {
                    toast.error('Selected slot was just booked. Please pick another.', { position: "top-right", autoClose: 5000, theme: "dark", transition: Bounce });
                } else if (res.status === 404) {
                    toast.error('Service not found. Try again.', { position: "top-right", autoClose: 5000, theme: "dark", transition: Bounce });
                } else {
                    toast.error('Booking failed. Please try again later.', { position: "top-right", autoClose: 5000, theme: "dark", transition: Bounce });
                }
                return;
            }

            toast.success('Booking confirmed!', { position: "top-right", autoClose: 4000, theme: "dark", transition: Bounce });
        } catch (error) {
            console.log('Booking Submit error:', error);
            toast.error('Booking Not Confirmed', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-black">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-black">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            aria-invalid={!!errors.name}
                            className="border-gray-300 focus:border-black"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-black">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            aria-invalid={!!errors.email}
                            className="border-gray-300 focus:border-black"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-black">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={formData.phoneNo}
                            onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                            aria-invalid={!!errors.phoneNo}
                            className="border-gray-300 focus:border-black"
                        />
                        {errors.phoneNo && (
                            <p className="text-sm text-red-600">{errors.phoneNo}</p>
                        )}
                    </div>
                </CardContent>
            </Card>
            {/* Confirm Button */}
            <div className="text-center">

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg"
                    size="lg"
                >
                    {isSubmitting ?(<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 'Confirming...'</>)  : ('Confirm Booking')}
                </Button>

                <p className="text-sm text-gray-500 mt-4">
                    You will receive a confirmation email shortly after booking.
                </p>
            </div>
            <ToastContainer />
        </form>

    )
}