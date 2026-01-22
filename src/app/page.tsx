import Link from "next/link";
import { Button } from "@/app/components/ui/button"; // Assuming this exists, based on previous context. If not, I'll use standard <button> styling but usually setups have this.
// Actually, to be safe and avoid "module not found" if Button component is different, I will build standard buttons with Tailwind classes or check if I can assume components/ui exists.
// The user previously viewed `src/app/site/[slug]/page.tsx` which imported `Button` from `@/app/components/ui/button`. So it should be safe.
// Wait, to be super safe and fully self-contained as requested ("Create as a single-page..."), I will use raw HTML/Tailwind for buttons unless I'm sure. I'll use the imported Button if I can, but standard elements are safer if I want to guarantee "single file" request spirit.
// Actually, I will use standard HTML elements with Tailwind classes for maximum control and matching the "single-page HTML" request spirit while being in Next.js.
import { 
  CheckCircle2, 
  MessageCircle, 
  CreditCard, 
  Clock, 
  ChevronRight, 
  Menu, 
  X,
  Users,
  Brain,
  Dumbbell,
  Briefcase,
  GraduationCap,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  Code
} from "lucide-react";
import Image from "next/image";
import { LandingFooter } from "@/app/components/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
               <span className="font-bold text-white text-lg tracking-tight">Ap</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Appointor</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
                Log in
              </Link>
              <Link href="/signup">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:translate-y-px">
                  Start Free Trial
                </button>
              </Link>
            </div>
          </div>

          <div className="md:hidden">
             {/* Mobile Menu Button Placeholder - would need state for real implementation */}
             <button className="p-2 text-slate-600">
               <Menu className="w-6 h-6" />
             </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-28 pb-16 lg:pt-32 lg:pb-24 relative overflow-hidden flex items-center min-h-[calc(100vh-64px)]">
        {/* Background Elements - High Contrast Grid Pattern */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold uppercase tracking-wide mb-8 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                New: Payments Integration
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Stop Managing Appointments <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Manually</span>
              </h1>
              
              <p className="mt-6 text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Simple booking system for founders, indie devs, coaches, consultants & freelancers. 
                Stop juggling dates via WhatsApp, DMs, or Email. Let clients book you 24/7.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all hover:scale-105 shadow-xl hover:shadow-slate-200">
                    Start Free Trial
                  </button>
                </Link>
                <Link href="#demo" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                       <ChevronRight className="w-4 h-4" />
                    </span>
                    See Demo
                  </button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-500">14-day free trial. No credit card required.</p>
            </div>

            {/* Right Column: Hero Image */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                 <div className="rounded-xl overflow-hidden bg-slate-50 relative aspect-[4/3] lg:aspect-auto">
                    <Image 
                      src="/dashboard-mockup.png" 
                      alt="Appointor Dashboard" 
                      width={800} 
                      height={600} 
                      className="object-cover w-full h-full"
                    />
                 </div>
              </div>
              
              {/* Floating Elements (positioned closer to image now) */}
              <div className="absolute -right-4 top-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 hidden lg:block animate-bounce-slow z-20">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                       <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs text-slate-500 font-medium">New Booking</p>
                       <p className="text-sm font-bold text-slate-900">₹999.00 Received</p>
                    </div>
                 </div>
              </div>
              <div className="absolute -left-8 bottom-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 hidden lg:block animate-bounce-slow z-20" style={{ animationDelay: '1s' }}>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                       <Clock className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs text-slate-500 font-medium">Next Session</p>
                       <p className="text-sm font-bold text-slate-900">In 15 mins</p>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VIDEO WALKTHROUGH SECTION */}
      <section id="demo" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-purple-700 text-xs font-semibold uppercase tracking-wide mb-6">
              <Zap className="w-4 h-4" />
              See it in action
           </div>
           <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">
             Watch how easy it is to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">get booked</span>
           </h2>
           
           <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-video">
              <iframe 
                className="absolute inset-0 w-full h-full" 
                src="https://www.youtube.com/embed/ru9JoVg3A5o?si=1acHFz1ftCTVdPrH&amp;start=41" 
                title="Appointor Walkthrough" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
           </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Does this sound familiar?
              </h2>
              <p className="text-lg text-slate-600">
                You started your business to help people, not to become a full-time scheduler.
              </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-6">
                    <MessageCircle className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Manual Booking Chaos</h3>
                 <p className="text-slate-600 leading-relaxed">
                   "Are you free Tuesday?" "No, how about Wed?"... <br/>
                   Endless back-and-forth messages on WhatsApp, DM, or Email just to book one session.
                 </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                    <Clock className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">No-Shows & Late</h3>
                 <p className="text-slate-600 leading-relaxed">
                   Without automated reminders, clients forget. You waste time waiting for people who never show up.
                 </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 mb-6">
                    <CreditCard className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Chasing Payments</h3>
                 <p className="text-slate-600 leading-relaxed">
                   Awkwardly asking for screenshots of payments or waiting for transfers before confirming slots.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* SOLUTION / HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-20">
             <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
               The New Way to Book
             </h2>
             <p className="text-lg text-slate-600 max-w-2xl mx-auto">
               Automate your entire booking flow in 3 simple steps.
             </p>
           </div>

           <div className="relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 -z-10"></div>
              
              <div className="grid md:grid-cols-3 gap-12 text-center">
                 {/* Step 1 */}
                 <div className="relative bg-white pt-4">
                    <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200 mb-6 rotate-3 hover:rotate-6 transition-transform">
                      1
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Share Your Link</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Send your custom link (e.g., appointor.com/you) to clients or put it in your bio.
                    </p>
                 </div>

                 {/* Step 2 */}
                 <div className="relative bg-white pt-4">
                    <div className="w-16 h-16 mx-auto bg-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-200 mb-6 -rotate-3 hover:-rotate-6 transition-transform">
                      2
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Clients Book 24/7</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Clients see your available slots, pick a time that works for them, and pay upfront.
                    </p>
                 </div>

                 {/* Step 3 */}
                 <div className="relative bg-white pt-4">
                    <div className="w-16 h-16 mx-auto bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-200 mb-6 rotate-3 hover:rotate-6 transition-transform">
                      3
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">You Just Show Up</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Both of you get calendar invites and reminders. You start the session on time.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-bold mb-6">
               Built for Solo Professionals
             </h2>
             <p className="text-lg text-slate-400 max-w-2xl mx-auto">
               If you sell your time, Appointor helps you sell more of it with less effort.
             </p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { icon: Brain, label: "Coaches", color: "text-blue-400" },
                { icon: Briefcase, label: "Consultants", color: "text-purple-400" },
                { icon: Sparkles, label: "Therapists", color: "text-emerald-400" },
                { icon: Code, label: "Indie Devs", color: "text-cyan-400" },
                { icon: Users, label: "Founders", color: "text-indigo-400" },
                { icon: GraduationCap, label: "Tutors", color: "text-pink-400" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors text-center group cursor-default">
                  <div className={`mx-auto w-12 h-12 mb-4 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white">{item.label}</h3>
                </div>
              ))}
           </div>
           
           <div className="mt-12 text-center">
             <div className="inline-flex items-center gap-2 text-slate-400 bg-white/5 rounded-full px-4 py-2 text-sm">
               <Users className="w-4 h-4" />
               <span>Join 50+ professionals automating their workflow</span>
             </div>
           </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Everything you need to run your booking</h2>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                 <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                    <Smartphone className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Booking Page</h3>
                 <p className="text-slate-600">Your own branded booking page (e.g., appointor.com/coach-sarah) that works professionally on mobile and desktop.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors">
                 <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                    <Clock className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Availability</h3>
                 <p className="text-slate-600">Wake up to new bookings. Your calendar is open for business 24/7, even while you sleep.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                 <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Reduce No-Shows</h3>
                 <p className="text-slate-600">Automatic email reminders sent to clients before their sessions. Cut no-shows by up to 50%.</p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-colors">
                 <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                    <Zap className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Payments</h3>
                 <p className="text-slate-600">Integrate payment links. Collect fees upfront when clients book. No more chasing invoices.</p>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-pink-200 transition-colors">
                 <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-6">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Calendar Sync</h3>
                 <p className="text-slate-600">Connects with your Google Calendar so you're never double-booked. (Coming Soon)</p>
              </div>

              {/* Feature 6 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition-colors">
                 <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-6">
                    <Users className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-3">Client Database</h3>
                 <p className="text-slate-600">Keep track of your client history, past appointments, and notes in one secure place.</p>
              </div>
           </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <div className="mb-16">
             <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Simple Pricing</h2>
             <p className="text-lg text-slate-600">Everything you need. No hidden fees.</p>
           </div>
           
           <div className="max-w-lg mx-auto bg-white p-10 rounded-3xl shadow-xl border border-slate-100 relative">
              <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 rotate-12 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-full text-sm shadow-md">
                 Most Popular
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro Plan</h3>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-5xl font-extrabold text-slate-900">₹999</span>
                <span className="text-slate-500">/month</span>
              </div>
              <p className="text-sm text-slate-400 mb-8 border-b border-slate-100 pb-8">
                 (or $12/month for international users)
              </p>

              <ul className="space-y-4 mb-10 text-left">
                 {[
                   "Unlimited Bookings",
                   "Custom Booking Page",
                   "Email Reminders",
                   "Accept Payments",
                   "Client Management",
                   "Admin Dashboard"
                 ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                       <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                       <span>{feature}</span>
                    </li>
                 ))}
              </ul>

              <Link href="/signup">
                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-200">
                   Start 14-Day Free Trial
                </button>
              </Link>
              <p className="mt-4 text-xs text-slate-400">No credit card required to start.</p>
           </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
           
           <div className="space-y-8">
              <div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">What is Appointor?</h3>
                 <p className="text-slate-600">Appointor is a simple scheduling tool for professionals. It replaces the back-and-forth of DMs with a professional booking link where clients can book you instantly.</p>
              </div>
              <div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">How is this different from Calendly?</h3>
                 <p className="text-slate-600">We are designed specifically for paid 1-on-1 sessions for freelancers and solo-preneurs. We are more affordable (₹999 vs expensive enterprise tiers) and clearer to set up.</p>
              </div>
              <div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Do I need technical skills?</h3>
                 <p className="text-slate-600">Not at all. If you can set up an Instagram profile, you can set up Appointor. It takes about 5 minutes.</p>
              </div>
              <div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Can I cancel anytime?</h3>
                 <p className="text-slate-600">Yes, absolutely. There are no contracts. You can cancel your subscription with one click from your dashboard.</p>
              </div>
           </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-slate-900 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to stop juggling manual bookings?
            </h2>
            <p className="text-xl text-slate-300 mb-10">
              Join the professionals who save 10+ hours a week with Appointor.
            </p>
            <Link href="/signup">
               <button className="px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-2xl">
                  Start Your Free Trial
               </button>
            </Link>
         </div>
      </section>

      {/* FOOTER */}
      <LandingFooter />

    </div>
  );
}
