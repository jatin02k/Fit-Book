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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/75 z-10"></div>
          {/* Generic Service Environment */}
          <Image
            src="/hero.png"
            alt="Service Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-30 text-center px-4 max-w-5xl pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-white/90">Premium Service Experience</span>
          </div>

          <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-8">
            Welcome to <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {org.name}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10">
            Professional services tailored to your needs. Book online and manage your appointments with ease.
          </p>

          <div className="mt-10">
            <Link href={`/app/${slug}/services`}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border-0 rounded-xl">
                <Zap className="mr-2 h-5 w-5" />
                Book Now
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
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Booking Process</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Get started with your fitness journey in just a few clicks. Follow these simple steps to book your session.
              </p>
            </div>
            
            {/* ... (Roadmap steps ommitted for brevity, assume unchanged or separate edit if needed) ... */
             /* Actually, I should probably include the whole section or at least the start to be safe, but let's target specific blocks if possible. 
                Wait, I can replace the whole sections to be safe on spacing. */
            }
            <div className="relative max-w-5xl mx-auto">
               {/* Central Line */}
               <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-pink-500 to-purple-500 opacity-30"></div>

               {/* Step 1 */}
               <div className="relative flex items-center mb-12 md:mb-20">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-orange-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <MousePointerClick className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">1. Select Service</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Choose from our wide range of classes and personal training sessions that suit your goals.
                     </p>
                  </div>
               </div>

               {/* Step 2 */}
               <div className="relative flex items-center mb-12 md:mb-20 justify-end md:justify-start">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-pink-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <CalendarCheck className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">2. Select Date</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Pick a convenient date from our real-time availability calendar.
                     </p>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="relative flex items-center mb-12 md:mb-20">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-purple-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Clock className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">3. Choose Time Slot</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Select a time slot that fits perfectly into your daily schedule.
                     </p>
                  </div>
               </div>

               {/* Step 4 */}
               <div className="relative flex items-center mb-12 md:mb-20 justify-end md:justify-start">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <UserCheck className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">4. Personal Details</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Fill in your contact information so we can confirm your booking.
                     </p>
                  </div>
               </div>

               {/* Step 5 */}
               <div className="relative flex items-center mb-12 md:mb-20">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-green-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <CreditCard className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-3">5. Payment & Upload</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Complete the payment securely and upload the screenshot for verification.
                     </p>
                  </div>
               </div>

               {/* Step 6 */}
               <div className="relative flex items-center justify-end md:justify-start">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Mail className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">6. Confirmation</h3>
                     <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Receive an instant confirmation email with all your booking details.
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
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Us</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience premium service with personalized attention, expert professionals, and seamless booking.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1 text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse our live calendar and book slots that fit your schedule instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 text-center">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Visit Us</h3>
              <p className="text-gray-600 leading-relaxed">
                We are conveniently located. Come visit our facility to learn more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-1 text-center">
              <div className="bg-gradient-to-br from-violet-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform duration-500">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Contact Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Have questions? Our team is here to help you get started.
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
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Touch</span>
               </h2>
               <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                  Have questions? Contact {org.name} directly.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
               {/* Email */}
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Mail className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Email</h3>
                  <a href={`mailto:${org.email || `contact@${org.slug}.fitbook.app`}`} className="text-gray-600 text-base md:text-lg hover:text-orange-500 transition-colors">
                     {org.email || `contact@${org.slug}.fitbook.app`}
                  </a>
               </div>

               {/* Phone */}
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Phone className="h-8 w-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Phone</h3>
                  <a href={`tel:${org.phone || "+15551234567"}`} className="text-gray-600 text-base md:text-lg hover:text-pink-500 transition-colors">
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