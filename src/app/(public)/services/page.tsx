import { createClient } from "@/lib/supabase/server";
import { Check, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/app/(public)/figma/imageWithFallback";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";


// The main Server Component function
export default async function ServiceSelectionPage() {
  const supabase = await createClient();

  // 1. Fetch Services (A-2 Data) securely on the server
  const { data: services, error } = await supabase
    .from("services")
    .select("id, name, price, duration_minutes, description, features")
    .order("duration_minutes", { ascending: true });

  if (error) {
    // Handle database fetch errors
    return (
      <div className="text-center text-red-500 mt-20">
        Error loading services. Please check the database connection and keys.
      </div>
    );
  }
  if (!services || services.length === 0) {
    // Handle the case where the admin has not set up any services
    return (
      <div className="text-center mt-20 p-8">
        <h1 className="text-2xl font-semibold">
          No services available for booking.
        </h1>
      </div>
    );
  }

  const gradientClasses = [
    { gradient: "from-orange-500 to-pink-500", shadow: "shadow-pink-500/20" },
    { gradient: "from-blue-500 to-cyan-500", shadow: "shadow-cyan-500/20" },
    { gradient: "from-green-500 to-lime-500", shadow: "shadow-lime-500/20" },
  ];

  // 2. Render UI with Figma Styles and Real Data (C-1 Acceptance)
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full px-4 py-2 mb-4">
            <span className="text-sm bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Premium Services
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl text-black mb-4 tracking-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our range of expert-led fitness programs designed to
            help you achieve your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className={`overflow-hidden border-2 hover:border-transparent transition-all duration-300 hover:shadow-xl ${gradientClasses[index].shadow} group`}
            >
              <div className="aspect-video relative overflow-hidden">
                <ImageWithFallback
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fitbook/image${index}.jpeg`}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute top-4 right-4 bg-gradient-to-r ${gradientClasses[index].gradient} text-white px-3 py-1 rounded-full text-sm shadow-lg`}
                >
                  ${service.price}/session
                </div>
              </div>

              <CardHeader>
                <div className="mb-2">
                  <CardTitle className="text-xl text-black mb-1">
                    {service.name}
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    {service.duration_minutes}
                  </div>
                </div>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features?.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <div
                        className={`p-0.5 rounded-full bg-gradient-to-r ${gradientClasses[index].gradient} mr-3 flex-shrink-0`}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/book?serviceId=${service.id}`}
                  className="w-full"
                  passHref
                >
                  <Button
                    className={`
                    w-full text-white bg-gradient-to-r ${gradientClasses[index].gradient} 
                    hover:shadow-lg ${gradientClasses[index].shadow} transition-all duration-300 group-hover:scale-105
                  `}
                  >
                    Select {service.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
          <p className="text-gray-600 mb-4">
            Not sure which service is right for you?
          </p>
          <Link 
          href={'/contact'}
          className="w-full"
          passHref
          >
          <Button
            variant="outline"
            className="border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
          >
            Contact Us for Guidance
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
