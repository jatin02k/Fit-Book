'use client';
import Link from "next/link";
import { Button } from "./components/ui/button";
import { ArrowRight, CheckCircle2, BarChart3, Users, Zap, Sparkles, LayoutDashboard, Calendar, Link as LinkIcon, PlusCircle, Eye, Settings } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="cursor-pointer group">
              <h2 className="text-black tracking-tight flex items-center gap-2 text-2xl">
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Fit</span>
                <span>Book</span>
                <Sparkles className="h-4 w-4 text-orange-500 group-hover:animate-pulse" />
              </h2>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/admin/login">
                <Button variant="ghost" className="text-gray-600 hover:text-orange-500 hover:bg-gray-50">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* PREMIUM HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
           {/* Fallback to simple img tag if ImageWithFallback isn't globally available here, or use standard img */}
           <img 
            src="https://images.unsplash.com/photo-1758957646695-ec8bce3df462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwZXF1aXBtZW50JTIwbW9kZXJufGVufDF8fHx8MTc1OTc2MzMwM3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Modern gym equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/70 to-orange-900/80 z-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-blue-500/20 animate-pulse z-20"></div>
        </div>
        
        <div className="relative z-30 text-center px-4 max-w-5xl pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in-up">
            <Zap className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-white/90">The Operating System for Modern Gyms</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-8">
            Transform Your <br />
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Fitness Business
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10">
            Manage members, schedule classes, and accept payments with a beautiful, branded booking experience.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 px-8 py-6 text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 border-0 rounded-xl">
                 Start Your Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm bg-black/20">
                View Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT FITBOOK & STEPS (ROADMAP) */}
      <section id="features" className="py-12 md:py-24 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                All-in-One <br />
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Management Platform</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                FitBook streamlines your entire manufacturing process. From setting up your services to managing daily bookings, we have got you covered.
              </p>
            </div>

            <div className="relative max-w-5xl mx-auto">
               {/* Central Line */}
               <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-pink-500 to-purple-500 opacity-30"></div>

               {/* Step 1 */}
               <div className="relative flex items-center mb-12 md:mb-20">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-orange-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Users className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-2xl font-bold text-gray-900 mb-3">1. Create Account</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Sign up in seconds and get your own dedicated workspace to manage your fitness business.
                     </p>
                  </div>
               </div>

               {/* Step 2 */}
               <div className="relative flex items-center mb-12 md:mb-20 justify-end md:justify-start">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-pink-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Settings className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-2xl font-bold text-gray-900 mb-3">2. Create Service</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Define your classes, personal training slots, or facility hours with flexible configuration.
                     </p>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="relative flex items-center mb-12 md:mb-20">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-purple-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Calendar className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-2xl font-bold text-gray-900 mb-3">3. Calendar Dashboard</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Visualize your schedule, manage staff, and track occupancy with our intuitive calendar.
                     </p>
                  </div>
               </div>

               {/* Step 4 */}
               <div className="relative flex items-center mb-12 md:mb-20 justify-end md:justify-start">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <PlusCircle className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-2xl font-bold text-gray-900 mb-3">4. Manual Booking</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Handle walk-ins and phone bookings effortlessly by adding them directly to the system.
                     </p>
                  </div>
               </div>

               {/* Step 5 */}
               <div className="relative flex items-center mb-12 md:mb-20">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-green-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <Eye className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-0 md:w-1/2 md:pr-16 md:text-right">
                     <h3 className="text-2xl font-bold text-gray-900 mb-3">5. View Appointment</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Get detailed views of every appointment, including client details and payment status.
                     </p>
                  </div>
               </div>

               {/* Step 6 */}
               <div className="relative flex items-center justify-end md:justify-start">
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center z-10 shadow-sm">
                     <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white shadow-inner">
                        <LinkIcon className="h-5 w-5" />
                     </div>
                  </div>
                  <div className="ml-24 md:ml-auto md:w-1/2 md:pl-16 text-left">
                     <h3 className="text-2xl font-bold text-gray-900 mb-3">6. Custom Booking Link</h3>
                     <p className="text-gray-600 leading-relaxed">
                        Share your unique, branded booking link with clients so they can self-book anytime.
                     </p>
                  </div>
               </div>

            </div>
         </div>
      </section>


      {/* CALL TO ACTION */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
             <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to scale your fitness business?</h2>
               <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Join hundreds of gym owners who trust FitBook to power their operations.</p>
               <Link href="/signup">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 h-14 text-lg rounded-full font-semibold">
                    Get Started Now
                  </Button>
               </Link>
             </div>
             {/* Background glow */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-violet-600 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </section>

      {/* FOOTER & CONTACT */}
      <footer className="bg-gray-900 text-white pt-24 pb-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Section: Contact Info Merged */}
          <div className="grid md:grid-cols-3 gap-8 mb-20 border-b border-gray-800 pb-12">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-orange-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                      <p className="text-sm text-gray-400">Email Us</p>
                      <p className="font-semibold text-white">support@fitbook.com</p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-pink-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                      <p className="text-sm text-gray-400">Call Us</p>
                      <p className="font-semibold text-white">+1 (555) 123-4567</p>
                  </div>
              </div>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-purple-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                      <p className="text-sm text-gray-400">Support Hours</p>
                      <p className="font-semibold text-white">Mon-Fri, 9am - 5pm EST</p>
                  </div>
              </div>
          </div>

          {/* Middle Section: Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  FitBook
                </h2>
                <Sparkles className="h-4 w-4 text-orange-400" />
              </div>
              <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                The comprehensive operating system designed for modern gyms and fitness studios. Simplify management, automate workflows, and scale your business.
              </p>
              <div className="flex gap-4">
                {/* Social Placeholders */}
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all cursor-pointer">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
                 <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white transition-all cursor-pointer">
                  <span className="sr-only">Instagram</span>
                   <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
                 <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-500 hover:text-white transition-all cursor-pointer">
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
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-gray-500 text-sm">© 2024 FitBook Inc. All rights reserved.</p>
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
