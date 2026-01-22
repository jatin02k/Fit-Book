"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface BusinessDetailsFormProps {
  initialName: string;
  initialPhone: string;

  orgId: string;
  initialRazorpayKeyId?: string;
  initialRazorpayKeySecret?: string;
}

export function BusinessDetailsForm({ initialName, initialPhone, orgId, slug, initialRazorpayKeyId, initialRazorpayKeySecret }: BusinessDetailsFormProps & { slug: string }) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [razorpayKeyId, setRazorpayKeyId] = useState(initialRazorpayKeyId || "");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState(initialRazorpayKeySecret || "");
  


  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const bookingLink = typeof window !== 'undefined' ? `${window.location.origin}/app/${slug}` : `/app/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {


      // 2. Update Organization Record
      const { error } = await supabase
        .from("organizations")
        .update({ 
            name, 
            phone,
            razorpay_key_id: razorpayKeyId,
            razorpay_key_secret: razorpayKeySecret
        })
        .eq("id", orgId);

      if (error) throw error;

      setMessage({ type: "success", text: "Business details updated successfully." });
      router.refresh();
    } catch (error: unknown) {
      console.error("Error updating business details:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update details.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Details</CardTitle>
        <CardDescription>Update your business name, contact info, and payment QR code.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="booking-link">Customer Booking Link</Label>
            <div className="flex items-center gap-2">
              <Input
                id="booking-link"
                value={bookingLink}
                readOnly
                className="bg-gray-50 text-gray-500"
              />
              <Button type="button" variant="outline" size="icon" onClick={handleCopyLink}>
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <span className="text-xs font-bold">COPY</span>}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Share this link with your customers to let them book appointments.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              id="business-name"
              placeholder="Enter business name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="business-phone">Phone Number</Label>
            <Input
              id="business-phone"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid gap-2 pt-4 border-t">
            <h3 className="font-semibold text-gray-900">Payment Integration (Razorpay)</h3>
            <p className="text-xs text-gray-500 mb-2">
                Enter your Razorpay API keys to accept payments from customers directly.
            </p>
            
            <div className="grid gap-2">
                <Label htmlFor="razorpay-key-id">Key ID</Label>
                <Input
                    id="razorpay-key-id"
                    name="razorpayKeyId"
                    placeholder="rzp_test_..."
                    value={razorpayKeyId}
                    onChange={(e) => setRazorpayKeyId(e.target.value)}
                />
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="razorpay-key-secret">Key Secret</Label>
                <Input
                    id="razorpay-key-secret"
                    name="razorpayKeySecret"
                    type="password"
                    placeholder="Enter Key Secret"
                    value={razorpayKeySecret}
                    onChange={(e) => setRazorpayKeySecret(e.target.value)}
                />
            </div>
          </div>



          {message && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
