import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { MapPin, Clock, Phone, Sparkles, Zap, CalendarCheck, CreditCard, UserCheck, Mail, MousePointerClick } from "lucide-react";
import Image from "next/image";

interface TenantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TenantHomePage({ params }: TenantPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Basic Info
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (orgError || !org) {
    return notFound();
  }

  // Feature Gating: Block access if subscription is inactive
  if (org.subscription_status !== 'active') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bookings Unavailable</h1>
          <p className="text-gray-600">
            This business is currently unable to accept bookings. Please contact them directly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* PREMIUM HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900 border-b border-white/5">
        <div className="absolute inset-0 z-0">
           {/* Abstract Gradient Background */}
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-slate-900 to-slate-950"></div>
           <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl opacity-50"></div>
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>

        <div className="relative z-30 text-center px-4 max-w-5xl pt-20">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 mb-8 animate-fade-in-up shadow-xl">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-white/90 font-medium tracking-wide">Professional Services</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
            Book a Session with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {org.name}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 font-light">
            Schedule your appointment online. Simple, secure, and instant confirmation.
          </p>

          <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <Link href={`/app/${slug}/services`}>
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-950 px-10 py-7 text-lg shadow-2xl shadow-blue-500/20 transition-all duration-300 hover:scale-105 border-0 rounded-full font-bold">
                <Zap className="mr-2 h-5 w-5 text-blue-600" />
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW TO BOOK SECTION (ROADMAP) */}
      <section className="py-12 md:py-24 bg-white relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-6">
                Simple <br />
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Booking Process</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Book your appointment in just a few clicks.
              </p>
            </div>
            
            <div className="relative max-w-5xl mx-auto">
               {/* Central Line */}
               <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-violet-500 opacity-30"></div>

               {/* Step 1 */}
               <div className="relative flex items-center mb-12 md:mb-20">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <MousePointerClick className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">1. Select Service</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Choose the service that fits your needs.
                     </p>
                  </div>
               </div>

               {/* Step 2 */}
               <div className="relative flex items-center mb-12 md:mb-20 justify-end md:justify-start">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <CalendarCheck className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">2. Choose Time</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Pick a convenient slot with your preferred expert.
                     </p>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="relative flex items-center mb-12 md:mb-20">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-purple-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <UserCheck className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">3. Your Details</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Fill in your info to create your booking.
                     </p>
                  </div>
               </div>

               {/* Step 4 */}
               <div className="relative flex items-center justify-end md:justify-start">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-fuchsia-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <CreditCard className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">4. Confirm & Pay</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Secure your booking instantly.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* PREMIUM INFO SECTION */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{org.name}</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide professional services tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1 text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Verified Professional</h3>
              <p className="text-gray-600 leading-relaxed">
                Book with confidence. We are dedicated to providing high-quality service and expertise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed">
                Powered by trusted payment gateways. Your transaction is safe, fast, and secure.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-1 text-center">
              <div className="bg-gradient-to-br from-violet-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-500">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                No back-and-forth emails. View live availability and secure your slot in seconds.
              </p>
            </div>

          </div>
        </div>
      </section>
      
      {/* TENANT CONTACT SECTION */}
      <section id="contact" className="py-12 md:py-24 bg-gray-50 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
               <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-6">
                  Get in <br />
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Touch</span>
               </h2>
               <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Have questions? Contact {org.name} directly.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
               {/* Email */}
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Email</h3>
                  <a href={`mailto:${org.email || `contact@${org.slug}.appointor.com`}`} className="text-gray-600 text-base md:text-lg hover:text-blue-500 transition-colors">
                     {org.email || `contact@${org.slug}.appointor.com`}
                  </a>
               </div>

               {/* Phone */}
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Phone className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Phone</h3>
                  <a href={`tel:${org.phone || "+15551234567"}`} className="text-gray-600 text-base md:text-lg hover:text-indigo-500 transition-colors">
                     {org.phone || "+1 (555) 123-4567"}
                  </a>
               </div>

               {/* Hours */}
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Opening Hours</h3>
                  <div className="text-gray-600 text-sm md:text-base">
                     <p>Mon - Fri: 9:00 AM - 9:00 PM</p>
                     <p>Sat - Sun: 10:00 AM - 6:00 PM</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}