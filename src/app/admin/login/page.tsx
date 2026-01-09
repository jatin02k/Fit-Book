"use client";
import Link from "next/link";

// 1. Updated Imports for Supabase
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr"; // Official Client

import { Loader2, LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Initialize Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 3. The Magic: Supabase handles the password check securely
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message); // e.g. "Invalid login credentials"
      setIsLoading(false);
    } else {
      // 4. Success! Fetch Slug + Redirect
      const { data: { user } } = await supabase.auth.getUser();
      
      if(user){
          const { data: org } = await supabase
            .from("organizations")
            .select("slug")
            .eq("owner_id", user.id)
            .single();

          if (org) {
             const protocol = window.location.protocol;
             const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
             // e.g. "gold.localhost:3000"
             const targetHost = `${org.slug}.${domain}`;
             const currentHost = window.location.host;

             if (currentHost === targetHost) {
                 console.log("Already on correct tenant domain, using router.replace");
                 router.replace("/admin/dashboard");
             } else {
                 const targetUrl = `${protocol}//${targetHost}/admin/dashboard`;
                 console.log("Redirecting to Tenant Dashboard:", targetUrl);
                 window.location.href = targetUrl; 
             }
             return;
          }
      }

      // Fallback if something fails (shouldn't happen for valid users)
      router.refresh(); 
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center text-indigo-600">
            <LogIn className="w-5 h-5 mr-2" /> FitBook Login
          </CardTitle>
          <CardDescription>
            Secure access via Supabase Auth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Start your 14-day free trial
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}