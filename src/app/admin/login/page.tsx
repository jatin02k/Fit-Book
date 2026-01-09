"use client";
import Link from "next/link";

// 1. Updated Imports for Supabase
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

import { Loader2, LogIn, Home } from "lucide-react";
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
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Initialize Supabase Client (Shared Config)
  const supabase = createClient();

  const handleRedirect = async (user: User) => {
      // 4. Success! Fetch Slug + Redirect
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
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("User already logged in, redirecting...");
        await handleRedirect(user);
      } else {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, [supabase, router]);

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
      console.error("Login failed:", signInError);
      setError(signInError.message); 
      setIsLoading(false);
    } else {
      console.log("Login successful, checking session...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
         console.error("Login succeeded but no user session found (Cookie issue?).");
         setError("Login succeeded but session failed. Please try again.");
         setIsLoading(false);
         return;
      }

      // Small delay to ensure cookie propagation
      setTimeout(async () => {
         await handleRedirect(user);
      }, 500);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-0 right-1/4 translate-y-1/2 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: "2s" }}></div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center pb-2 pt-8">
          <Link href="/" className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black backdrop-blur-md border border-white/10 text-white shadow-xl hover:bg-gray-500 hover:scale-110 transition-all duration-300 group">
         <Home className="w-5 h-5 text-white/80 group-hover:text-red" />
      </Link>
           <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <LogIn className="w-6 h-6 text-white" />
           </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-gray-500 mt-2">
            Sign in to manage your fitness business
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-red-500"></div>
                 {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-6 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
             <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500">Forgot password?</a>
             </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-6 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg shadow-orange-500/25 transition-all duration-200 font-semibold text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">Don&apos;t have an account? </span>
            <Link href="/signup" className="font-semibold text-orange-600 hover:text-orange-500">
              Start your 14-day free trial
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <div className="absolute bottom-6 text-center text-white/40 text-xs z-10">
         &copy; {new Date().getFullYear()} FitBook. All rights reserved.
      </div>
    </div>
  );
}