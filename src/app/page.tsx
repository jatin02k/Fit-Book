'use client';
import Link from "next/link";
import { Button } from "./components/ui/button";
import { Users, Zap, Calendar, Link as LinkIcon, PlusCircle, Eye, Settings } from "lucide-react";
import { LandingHeader } from "@/app/components/LandingHeader";
import { LandingFooter } from "@/app/components/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <LandingHeader />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          {/* Generic Business/Modern Office Background */}
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="Modern Office Environment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-black/60 to-blue-900/80 z-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse z-20"></div>
        </div>
        
        <div className="relative z-30 text-center px-4 max-w-5xl pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in-up hover:bg-white/20 transition-colors cursor-default">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-white/90 font-medium">The Operating System for Service Businesses</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
            Streamline Your <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Service Business
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 font-light">
            Empower your business or consultancy with effortless scheduling, appointment management, and payments.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border-0 rounded-xl font-semibold">
                 Start Your Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm bg-black/20 font-semibold">
                View Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES ROADMAP */}
      <section id="features" className="py-12 md:py-24 bg-slate-50 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                All-in-One <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Management Platform</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Appointor creates a seamless workflow for your business. From defining services to managing appointments, we handle the complexity so you can focus on your clients.
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
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Create Account</h3>
                     <p className="text-slate-600 leading-relaxed">
                        Sign up quickly and establish your dedicated digital workspace for your practice or studio.
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
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">2. Define Services</h3>
                     <p className="text-slate-600 leading-relaxed">
                        Configure your service menu, consultation types, or session slots with flexible durations and pricing.
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
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">3. Smart Calendar</h3>
                     <p className="text-slate-600 leading-relaxed">
                        Manage your availability, staff schedules, and appointments in one centralized, intuitive dashboard.
                     </p>
                  </div>
               </div>

               {/* Step 4 */}
               <div className="relative flex items-center mb-12 md:mb-20 justify-end md:justify-start group">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-fuchsia-50 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                     <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <PlusCircle className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">4. Admin Booking</h3>
                     <p className="text-slate-600 leading-relaxed">
                        Easily handle phone or walk-in appointments by adding them directly to your system.
                     </p>
                  </div>
               </div>

               {/* Step 5 */}
               <div className="relative flex items-center mb-12 md:mb-20 group">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-rose-50 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                     <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Eye className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">5. Client Insights</h3>
                     <p className="text-slate-600 leading-relaxed">
                        Access detailed client history, preferences, and payment status at a glance.
                     </p>
                  </div>
               </div>

               {/* Step 6 */}
               <div className="relative flex items-center justify-end md:justify-start group">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-amber-50 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform duration-300">
                     <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <LinkIcon className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">6. Brand Portal</h3>
                     <p className="text-slate-600 leading-relaxed">
                        Share your custom branded booking portal with clients for 24/7 self-service scheduling.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* CALL TO ACTION */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
             <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to professionalize your workflow?</h2>
               <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Join thousands of professionals who trust Appointor to run their business smoothly.</p>
               <Link href="/signup">
                  <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-8 h-14 text-lg rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    Get Started Now
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
