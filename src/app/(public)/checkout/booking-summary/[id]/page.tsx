// app/booking-summary/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default async function BookingSummary({
  params,
}: {
  params: Promise<{ id: string }>; // Update type to Promise
}) {
  const { id } = await params;
  const cancellationId =id;
  const supabase = await createClient();

  // 1) Fetch appointment
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("*")
    .eq("cancellation_link_uuid", cancellationId)
    .single();

  if (appointmentError || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-xl text-gray-700">
          Booking not found or expired.
        </p>
      </div>
    );
  }

  // 2) Fetch service info
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("name, price")
    .eq("id", appointment.service_id)
    .single();

  if (serviceError || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-xl text-gray-700">
          Service information missing.
        </p>
      </div>
    );
  }

  // Format date/time
  const start = new Date(appointment.start_time);
  const formattedDate = start.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = start.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl text-black mb-2 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your appointment has been successfully scheduled.
          </p>
        </div>

        {/* BOOKING DETAILS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-black">Booking Details</CardTitle>
            <p className="text-sm text-gray-600">Booking ID: {cancellationId}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Service</h3>
                  <p className="text-black">{service.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Price</h3>
                  <p className="text-black">₹{service.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Date</h3>
                  <p className="text-black">{formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">Time</h3>
                  <p className="text-black">{formattedTime}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm text-gray-600 mb-2">Contact Information</h3>
                <div className="space-y-1">
                  <p className="text-black">{appointment.customer_name}</p>
                  <p className="text-gray-600">{appointment.email}</p>
                  {appointment.phone_number && (
                    <p className="text-gray-600">{appointment.phone_number}</p>
                  )}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* NEXT STEPS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-black">What to do Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">

              <li className="flex items-start">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                <div>
                  <p className="text-black">Check your email</p>
                  <p className="text-sm text-gray-600">
                    A confirmation email has been sent to {appointment.email}
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                <div>
                  <p className="text-black">Arrive 15 minutes early</p>
                  <p className="text-sm text-gray-600">
                    Please arrive at least 15 minutes before your scheduled time.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                <div>
                  <p className="text-black">Bring essentials</p>
                  <p className="text-sm text-gray-600">
                    Make sure to carry any required documents or items.
                  </p>
                </div>
              </li>

            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            Need help? Contact support at 6778-90
          </p>
        </div>

      </div>
    </div>
  );
}