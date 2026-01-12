import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import z from "zod";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import BookingForm from "@/app/components/bookingForm";
import { ImageWithFallback } from "../figma/imageWithFallback";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ serviceId?: string; date?: string; time?: string }>;
}) {
  const { slug } = await params;
  const paramsSchema = z.object({
    serviceId: z.uuid().optional(),
    date: z.string().optional(), // YYYY-MM-DD (we will pass-through to client validation)
    time: z.string().optional(), // HH:mm (24h)
  });
  const resolvedSearchParams = await searchParams; // Await params in Next 15promise

  const parsed = paramsSchema.safeParse(resolvedSearchParams);

  // Create a CLEAN object that only contains plain strings/values
  const serviceId = parsed.success ? parsed.data.serviceId ?? "" : "";
  const bookingDate = parsed.success ? parsed.data.date ?? "" : "";
  const bookingTime = parsed.success ? parsed.data.time ?? "" : "";

  const supabase = await createClient();
  const { data: serviceData, error: serviceError } = await supabase
    .from("services")
    .select(`
      name, 
      price, 
      duration_minutes,
      organizations (
        qr_code_url
      )
    `)
    .eq("id", serviceId)
    .single();

  if (!serviceId || !serviceData || serviceError) {
    notFound();
  }

  // Extract QR Code URL safely
  const qrCodeUrl = serviceData.organizations?.qr_code_url || undefined;

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/app/${slug}/book/${serviceId}`}>
            <Button
              variant="outline"
              className="mb-4 border-black text-black hover:bg-black hover:text-white"
            >
              ← Back to Time Selection
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl text-black mb-2 tracking-tight">
            Complete Your Booking
          </h1>
          <p className="text-xl text-gray-600">
            Just a few details and you are all set!
          </p>
        </div>

        <div className="space-y-8">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-black">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="text-black">{serviceData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-black">
                    {(() => {
                      const dateObj = bookingDate
                        ? new Date(bookingDate)
                        : null;
                      return dateObj && !isNaN(dateObj.getTime())
                        ? dateObj.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : bookingDate;
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="text-black">{bookingTime}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-black">Total:</span>
                  <span className="text-xl text-black">
                    ₹{serviceData.price}
                  </span>
                </div>
              </div>
              {/* QR Code Display Section */}
            {qrCodeUrl && (
              <div className="mb-4 p-4 bg-gray-50 border rounded-lg flex flex-col items-center text-center">
                 <p className="text-sm font-semibold text-gray-700 mb-2">Scan to Pay</p>
                 <div className="relative bg-white p-2 rounded-lg shadow-sm w-48 h-48 mb-2">
                    <Image 
                      src={qrCodeUrl} 
                      alt="Payment QR Code" 
                      className="object-contain"
                      fill
                      unoptimized
                    />
                 </div>
                 <p className="text-xs text-gray-500">
                    Use your preferred payment app (Venmo, UPI, Bank App) to scan and pay.
                 </p>
              </div>
            )}
            </CardContent>
          </Card>

          {/* Contact Information Form */}
          <BookingForm
            serviceId={String(serviceId)}
            serviceName={serviceData.name}
            time={String(bookingTime)}
            date={String(bookingDate)}
            slug={slug}
            qrCodeUrl={qrCodeUrl}
          />
        </div>
      </div>
    </div>
  );
}
