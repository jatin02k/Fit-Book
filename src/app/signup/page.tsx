"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

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
    // Simple slugify: lowercase, replace spaces with dashes, remove special chars
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    
    setFormData((prev) => ({ ...prev, orgName: name, orgSlug: slug }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
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

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user created");
      
      // DEBUG: Check if we have a session
      console.log("Signup Info:", { 
         user_id: authData.user.id, 
         has_session: !!authData.session,
         session_user: authData.session?.user?.id 
      });

      if (!authData.session) {
         // This happens if Email Confirmation is enabled on Supabase.
         // We cannot Insert the Organization because we are not "authenticated" yet.
         setError("Please check your email to confirm your account before we can create your Dashboard.");
         return; 
      }

      // 2. Create Organization
      // Note: We need to use a public API route or ensure RLS allows INSERT for authenticated users.
      // Assuming RLS allows: authenticated users can insert row where owner_id = auth.uid()
      const { error: orgError } = await supabase.from("organizations").insert([
        {
          name: formData.orgName,
          slug: formData.orgSlug,
          owner_id: authData.user.id,
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
            throw new Error("This Gym Link (Slug) is already taken. Please choose another.");
        }
        throw orgError;
      }

      // 3. Success! Redirect to Tenant Dashboard
      const protocol = window.location.protocol;
      const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
      const targetUrl = `${protocol}//${formData.orgSlug}.${domain}/admin/dashboard`;
      
      console.log("Signup Complete. Redirecting to:", targetUrl);
      window.location.href = targetUrl;
      // router.push("/admin/dashboard"); // Old Logic

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Start your 14-day free trial
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link href="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSignup}>
            
            {/* Full Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">Business Details</span>
                </div>
            </div>

            {/* Organization Name */}
            <div>
              <Label htmlFor="orgName">Gym / Studio Name</Label>
              <div className="mt-1">
                <Input
                  id="orgName"
                  name="orgName"
                  type="text"
                  required
                  placeholder="e.g. Iron Pumpers Gym"
                  value={formData.orgName}
                  onChange={handleOrgNameChange}
                />
              </div>
            </div>

            {/* Organization Phone */}
             <div>
              <Label htmlFor="orgPhone">Business Phone Number</Label>
              <div className="mt-1">
                <Input
                  id="orgPhone"
                  name="orgPhone"
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 000-0000"
                  value={formData.orgPhone}
                  onChange={(e) => setFormData({ ...formData, orgPhone: e.target.value })}
                />
              </div>
            </div>

            {/* Organization Slug (Auto-generated & Read-only) */}
            <div>
                <Label>Your Public Booking Link</Label>
                <div className="mt-1 flex rounded-md shadow-sm bg-gray-50 border border-gray-300">
                  <span className="inline-flex items-center px-3 rounded-l-md border-r border-gray-300 bg-gray-100 text-gray-500 sm:text-sm">
                    fitbook.app/
                  </span>
                  <div className="flex-1 px-3 py-2 text-gray-700 sm:text-sm truncate">
                     {formData.orgSlug || "your-gym-name"}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This link is automatically generated for your customers.
                </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account & Dashboard"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
