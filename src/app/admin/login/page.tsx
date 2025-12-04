"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2, LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/(public)/components/ui/card";
import { Label } from "@/app/(public)/components/ui/label";
import { Input } from "@/app/(public)/components/ui/input";
import { Button } from "@/app/(public)/components/ui/button";

/**
 * PHASE B4 - Admin Login Page (A-1)
 * Client Component handles form submission to the secure /api/admin/login route.
 */
export default function AdminLoginPage() {
  const router = useRouter();

  // State to hold form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State to manage submission status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = { email, password };

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (res.ok) {
        // SUCCESS: Redirect to the protected dashboard
        router.push("/admin/dashboard");
      } else {
        // FAILURE: Read the error message from the backend API (401 Unauthorized)
        const data = await res.json();
        setError(data.error || "Login failed due to an unknown error.");
      }
    } catch (err) {
      console.error("Network Error during login:", err);
      setError("Network error. Could not connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center text-indigo-600">
            <LogIn className="w-5 h-5 mr-2" /> Admin Login
          </CardTitle>
          <CardDescription>
            Access the FitBook Management Dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@fitbook.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Authenticating...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
