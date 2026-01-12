"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Home } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
    orgSlug: "",
    orgPhone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug from organization name
  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    // Slugify: lowercase, replace spaces with dashes, remove special chars
    // Append a random 4-char string to ensure uniqueness
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    
    // We update this in real-time. To avoid jitter, maybe we don't append random chars visibly?
    // User complaint: "cant keep the gym name same coz it means slug becomes same".
    // Solution: We should append a unique ID internally or let them edit it.
    // For MVP, let's append a random number to the slug in the state.
    const uniqueSlug = baseSlug ? `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}` : "";

    setFormData((prev) => ({ ...prev, orgName: name, orgSlug: uniqueSlug }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let user = null;

      // 1. Sign Up User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (authError) {
          // RECOVERY MECHANISM: If user exists, try to log them in.
          // If they log in successfully and HAVE NO ORG, we should let them finish signup (create org).
          if (authError.message.includes("already registered") || authError.message.includes("User already registered")) {
              console.log("User exists. Attempting recovery login...");
              const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
                  email: formData.email,
                  password: formData.password
              });

              if (signinError) {
                   // If password wrong or other error, fallback to standard error
                   throw new Error("This email is already registered. Please Log In.");
              }
              
              user = signinData.user;
          } else {
              throw authError;
          }
      } else {
         user = authData.user;
      }
      
      if (!user) throw new Error("Authentication failed");
      
      // Check if we have a valid session (required for RLS)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
          setError("Please check your email to confirm your account before we can create your Dashboard.");
          return;
      }

      // Check if Org already exists (Duplicate check)
      const { data: existingOrg } = await supabase
        .from("organizations")
        .select("slug")
        .eq("owner_id", user.id)
        .single();

      if (existingOrg) {
           // User has an account AND an Org. Just redirect them.
           console.log("User and Org already exist. Redirecting...");
           const protocol = window.location.protocol;
           const host = window.location.host;
           const targetUrl = `${protocol}//${host}/app/${existingOrg.slug}/admin/dashboard`;
           window.location.href = targetUrl;
           return;
      }

      // 2. Create Organization (If we reached here, User is Authed, but Org is missing)
      console.log("Creating Organization for user:", user.id);

      // 2. Create Organization
      // Note: We need to use a public API route or ensure RLS allows INSERT for authenticated users.
      // Assuming RLS allows: authenticated users can insert row where owner_id = auth.uid()
      const { error: orgError } = await supabase.from("organizations").insert([
        {
          name: formData.orgName,
          slug: formData.orgSlug,
          owner_id: user.id,
          type: "gym", // Default type
          email: formData.email,
          phone: formData.orgPhone,
          subscription_status: "trial",
        },
      ]);

      if (orgError) {
        // If org creation fails, it feels bad. We might need to rollback or handle it.
        // Common cause: Slug already exists.
        if (orgError.code === "23505") { // Unique violation
            // Try again with a new random slug? Or just tell user.
            throw new Error("This Gym Link (Slug) is still taken. Please try changing the Gym Name slightly.");
        }
        throw orgError;
      }

      // 3. Success! Redirect to Tenant Dashboard
      const protocol = window.location.protocol;
      const host = window.location.host; // e.g. fitbook.vercel.app or localhost:3000
      
      // Path-Based Redirection
      // targetUrl = protocol + // + host + /app/ + slug + /admin/dashboard
      const targetUrl = `${protocol}//${host}/app/${formData.orgSlug}/admin/dashboard`;
      
      console.log("Signup Complete. Redirecting to:", targetUrl);
      window.location.href = targetUrl;

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative">
      <Link href="/" className="absolute top-6 right-6 z-50 p-2.5 rounded-full shadow-lg hover:scale-110 transition-all duration-300 lg:bg-black lg:text-white lg:border-gray-200 lg:backdrop-blur-md border border-gray-200 bg-white text-gray-700 lg:border-transparent lg:hover:bg-white/20 group">
          <Home className="w-5 h-5 group-hover:text-orange-500 lg:group-hover:text-red transition-colors" />
      </Link>

      {/* BRAND PANEL (LEFT) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-8">
             <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                <span className="font-bold text-white">A</span>
             </div>
             <span className="text-2xl font-bold tracking-tight">Appointor</span>
          </Link>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Manage your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              business empire
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-md">
             Join thousands of business owners who trust Appointor to automate bookings, payments, and member management.
          </p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl"></div>

        {/* Testimonial / Footer */}
        <div className="relative z-10">
           <blockquote className="space-y-2">
              <p className="text-lg font-medium">
                &ldquo;Appointor transformed how we run our studio. The booking experience is flawless for our clients.&rdquo;
              </p>
              <footer className="text-sm text-gray-500">
                — Sarah Jenkins, Founder of CoreFlow Yoga
              </footer>
           </blockquote>
        </div>
      </div>

      {/* FORM SIDER (RIGHT) - COMPACT LAYOUT */}
      <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 h-screen overflow-y-auto">
        <div className="mx-auto w-full max-w-lg lg:max-w-2xl">
          <div className="lg:hidden mb-4 text-center">
             <Link href="/" className="inline-flex items-center gap-2">
                 <span className="text-2xl font-bold tracking-tight text-gray-900">Appointor</span>
             </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
              Create account
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Start your 7-day free trial. {" "}
              <Link href="/admin/login" className="font-medium text-orange-600 hover:text-orange-500">
                Already have an account?
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignup}>
            {/* Personal Details */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    Personal Details
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <Label htmlFor="name" className="text-gray-700 text-xs uppercase font-semibold">Full Name</Label>
                       <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-gray-50/50"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       />
                    </div>
                    <div>
                       <Label htmlFor="email" className="text-gray-700 text-xs uppercase font-semibold">Email</Label>
                       <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-gray-50/50"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                       />
                    </div>
                </div>
                 <div>
                   <Label htmlFor="password" className="text-gray-700 text-xs uppercase font-semibold">Password</Label>
                   <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-gray-50/50"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                   />
                </div>
            </div>

            {/* Business Details */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                    Business Info
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <Label htmlFor="orgName" className="text-gray-700 text-xs uppercase font-semibold">Business Name</Label>
                       <Input
                          id="orgName"
                          name="orgName"
                          type="text"
                          required
                          className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-gray-50/50"
                          placeholder="Iron Pumpers"
                          value={formData.orgName}
                          onChange={handleOrgNameChange}
                       />
                    </div>
                     <div>
                       <Label htmlFor="orgPhone" className="text-gray-700 text-xs uppercase font-semibold">Phone</Label>
                       <Input
                          id="orgPhone"
                          name="orgPhone"
                          type="tel"
                          required
                          className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-gray-50/50"
                          placeholder="+1 (555) 000-0000"
                          value={formData.orgPhone}
                          onChange={(e) => setFormData({ ...formData, orgPhone: e.target.value })}
                       />
                    </div>
                </div>
            </div>

            {error && (
               <div className="rounded-xl bg-red-50 p-3 border border-red-100">
                  <div className="flex items-center">
                     <AlertCircle className="h-4 w-4 text-red-500 mr-2" aria-hidden="true" />
                     <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
               </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-500/20 text-sm font-bold tracking-wide text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? "Creating..." : "Start Free Trial"}
            </Button>
          </form>
           
           <p className="mt-4 text-center text-xs text-gray-400">
              By joining, you agree to our <a href="#" className="underline hover:text-gray-600">Terms</a>.
           </p>
        </div>
      </div>
    </div>
  );
}
