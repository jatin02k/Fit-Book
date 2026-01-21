"use client";

import { bookingSchema } from "@/lib/validation/bookingSchema";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast, ToastContainer } from "react-toastify";
import z from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type BookingFormProps = {
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  slug: string;
};

export default function BookingForm({
  serviceId,
  date,
  time,
  slug,
}: BookingFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
  });


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-only schema (NO file here)
  const clientSchema = useMemo(
    () =>
      z.object({
        name: bookingSchema.shape.name,
        email: bookingSchema.shape.email,
        phoneNo: bookingSchema.shape.phoneNo.optional(),
      }),
    []
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1️⃣ Basic checks


    // 2️⃣ Validate form fields
    const parsed = clientSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[String(i.path[0])] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // 3️⃣ File type guard


    setIsSubmitting(true);
    const supabase = await createClient();

    try {


      // 6️⃣ Build final payload
      const startTime = new Date(`${date}T${time}`).toISOString();

      const payload = {
        ...formData,
        serviceId,
        startTime,
      };

      // 7️⃣ Server-level validation safety
      const serverParsed = bookingSchema.safeParse(payload);
      if (!serverParsed.success) {
        throw new Error("Invalid booking data");
      }

      // 8️⃣ Send to API
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Booking failed");
      }

      toast.success("Booking submitted!");
      router.push(
        `/app/${slug}/checkout/booking-summary/${data.cancellationLinkUuid}`
      );
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                handleInputChange("name", e.target.value)
              }
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={formData.phoneNo}
              onChange={(e) =>
                handleInputChange("phoneNo", e.target.value)
              }
            />
          </div>


        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-6 text-lg hover:bg-gray-800"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Confirm Booking"
        )}
      </Button>

      <ToastContainer />
    </form>
  );
}
