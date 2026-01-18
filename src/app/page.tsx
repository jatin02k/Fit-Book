'use client';
import Link from "next/link";
import { Button } from "./components/ui/button";
import { Users, Zap, Calendar, Link as LinkIcon, PlusCircle, Eye, Settings, CheckCircle2, XCircle } from "lucide-react";
import { LandingHeader } from "@/app/components/LandingHeader";
import { LandingFooter } from "@/app/components/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <LandingHeader />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-8 animate-fade-in-up">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-900 font-medium">For Modern Physiotherapy Clinics</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                The Operating System for <span className="text-blue-600">Physiotherapy Clinics</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 font-light leading-relaxed">
                Automate patient bookings, reduce no-shows with smart reminders, and streamline payments. The simplest way to run your practice.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                    Start Free Trial — No Credit Card Needed
                  </Button>
                </Link>
              </div>

              <div className="space-y-3 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Reduce patient no-shows automatically</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Instant QR payments at the front desk</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Digital patient records in one dashboard</span>
                </div>
              </div>
            </div>

            {/* Hero Visuals */}
            <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <img 
                  src="/images/dashboard-mockup.png" 
                  alt="Physio Clinic Dashboard" 
                  className="w-full h-auto"
                />
              </div>
              {/* Floating Phone Element */}
              <div className="absolute -bottom-12 -right-4 w-48 md:w-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-20 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                 <img 
                  src="/images/qr-payment-demo.png" 
                  alt="Patient Payment Demo" 
                  className="w-full h-auto"
                />
              </div>
              {/* Background Blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM VS SOLUTION SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            {/* Problem */}
            <div className="bg-red-50 rounded-3xl p-8 md:p-12 border border-red-100">
              <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-1.5 mb-6">
                <span className="text-sm text-red-800 font-bold uppercase tracking-wider">The Struggle</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Is your front desk overwhelmed?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-700 text-lg">Receptionists manually calling patients for reminders</p>
                </li>
                <li className="flex items-start gap-4">
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-700 text-lg">Last-minute cancellations leaving empty treatment slots</p>
                </li>
                <li className="flex items-start gap-4">
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-700 text-lg">Messy paper records or scattered Excel sheets</p>
                </li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-1.5 mb-6 relative z-10">
                <span className="text-sm text-blue-800 font-bold uppercase tracking-wider">The Solution</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 relative z-10">
                Automate your clinic
              </h2>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-700 text-lg">Patients book 24/7 via your custom clinic link</p>
                </li>
                 <li className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-700 text-lg">Auto-reminders reduce no-shows by up to 40%</p>
                </li>
                 <li className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-700 text-lg">Manage multiple therapists and rooms easily</p>
                </li>
                 <li className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-slate-700 text-lg">Professional invoices and payment tracking</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SETUP GUIDE (How it Works) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                Modernize Your Clinic in <span className="text-blue-600">Minutes</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Simple setup for therapists and clinic managers.
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
               {/* Central Line */}
               <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-violet-500 opacity-20"></div>

               {/* Step 1 */}
               <div className="relative flex items-center mb-12 md:mb-20 group">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Users className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Create Clinic Profile</h3>
                     <p className="text-slate-600 leading-relaxed">
                        Sign up and set your clinic&apos;s branding and location details.
                     </p>
                  </div>
               </div>

               {/* Step 2 */}
               <div className="relative flex items-center mb-12 md:mb-20 justify-end md:justify-start group">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                     <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Settings className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">2. Define Treatments</h3>
                     <p className="text-slate-600 leading-relaxed">
                         Add treatments like &quot;Initial Assessment&quot;, &quot;Manual Therapy&quot;, or &quot;Dry Needling&quot; with pricing and duration.
                     </p>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="relative flex items-center mb-12 md:mb-20 group">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-violet-50 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                     <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Calendar className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">3. Therapist Roster</h3>
                     <p className="text-slate-600 leading-relaxed">
                        Set working hours for each therapist and manage room availability.
                     </p>
                  </div>
               </div>

               {/* Step 4 */}
               <div className="relative flex items-center justify-end md:justify-start group">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-fuchsia-50 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                     <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <LinkIcon className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">4. Patient Portal</h3>
                     <p className="text-slate-600 leading-relaxed">
                        Share your booking link with patients. Approvals and payments happen automatically.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              See How Easy It Is
           </h2>
           <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-200">
              {/* YouTube Embed Placeholder */}
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/ru9JoVg3A5o?si=8PfATnGkerR5K44B" 
                title="Appointor Setup Tutorial" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
           </div>
        </div>
      </section>
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-16">Trusted by Growing Businesses</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-left">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-slate-700 mb-6 italic">“Appointor cut our no-shows by 40% in the first month. Our therapists love the organized schedule, and patients love booking online.”</p>
              <div>
                <div className="font-bold text-slate-900">Dr. Rajesh Sharma</div>
                <div className="text-slate-500 text-sm">Owner, City Physiotherapy Center</div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-left">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-slate-700 mb-6 italic">“The easiest clinic software I&apos;ve used. Setting up treatments and assigning staff took literally 5 minutes.”</p>
              <div>
                <div className="font-bold text-slate-900">Priya Singh</div>
                <div className="text-slate-500 text-sm">Senior Physiotherapist</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know about running your clinic with Appointor.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Do patients need to download an app?</h3>
              <p className="text-slate-600 leading-relaxed">
                No. Patients can book directly through your custom weblink or by scanning a QR code at your desk. It works instantly on any phone without downloads.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Can I manage multiple physiotherapists?</h3>
              <p className="text-slate-600 leading-relaxed">
                Yes! You can add unlimited staff members, each with their own working hours, treatment specialties, and calendar view.
              </p>
            </div>

             <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-2">What happens if a patient calls to book?</h3>
              <p className="text-slate-600 leading-relaxed">
                You or your receptionist can manually add the appointment to the calendar in seconds. The patient will still receive automated reminders.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Is patient data secure?</h3>
              <p className="text-slate-600 leading-relaxed">
                Absolutely. We use enterprise-grade encryption and security practices to ensure your clinic and patient data is always protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
             <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Automate Bookings & Payments Today</h2>
               <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Join the professionals saving time and revenue with Appointor.</p>
               <Link href="/signup">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-8 h-14 text-lg rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Start Free Trial
                  </Button>
               </Link>
             </div>
             {/* Background glow */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </section>

      {/* FOOTER & CONTACT */}
      <LandingFooter />
    </div>
  );
}
