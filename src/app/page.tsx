'use client';
import Link from "next/link";
import { Button } from "./components/ui/button";
import { ArrowRight, CheckCircle2, BarChart3, Users, Zap, Sparkles, LayoutDashboard, Calendar, Link as LinkIcon, PlusCircle, Eye, Settings, Clock, ShieldCheck, Globe, Mail, Phone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="cursor-pointer group">
              <h2 className="text-black tracking-tight flex items-center gap-2 text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Appointor</span>
                <Sparkles className="h-4 w-4 text-blue-600 group-hover:animate-pulse" />
              </h2>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/admin/login">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-blue-500/20">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

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
      <footer className="bg-slate-950 text-white pt-24 pb-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Section: Contact Info Merged */}
          <div className="grid md:grid-cols-3 gap-8 mb-20 border-b border-slate-800 pb-12">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-blue-400">
                      <Mail className="h-6 w-6" />
                  </div>
                  <div>
                      <p className="text-sm text-gray-400">Email Us</p>
                      <p className="font-semibold text-white">jatin02kr@gmail.com</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-indigo-400">
                      <Phone className="h-6 w-6" />
                  </div>
                  <div>
                      <p className="text-sm text-gray-400">Call Us</p>
                      <p className="font-semibold text-white">+91 9650584722</p>
                  </div>
              </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-violet-400">
                      <Clock className="h-6 w-6" />
                  </div>
                  <div>
                      <p className="text-sm text-gray-400">Support Hours</p>
                      <p className="font-semibold text-white">Mon-Fri, 9am - 6pm  IST</p>
                  </div>
              </div>
          </div>

          {/* Middle Section: Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Appointor
                </h2>
                <Sparkles className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                The comprehensive operating system designed for modern service-based businesses. Simplify management, automate workflows, and scale your operations.
              </p>
              <div className="flex gap-4">
                {/* Social Icons */}
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
                 <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all cursor-pointer">
                  <span className="sr-only">Instagram</span>
                   <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
                 <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                  <span className="sr-only">LinkedIn</span>
                   <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">Product</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Showcase</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">Company</h3>
              <ul className="space-y-4">
                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">Resources</h3>
              <ul className="space-y-4">
                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
                 <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-gray-500 text-sm">© 2024 Appointor Inc. All rights reserved.</p>
             <div className="flex gap-6">
                <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Use</a>
                <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Cookie Policy</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
