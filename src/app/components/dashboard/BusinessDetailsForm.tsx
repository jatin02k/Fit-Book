"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { AlertCircle, CheckCircle2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface BusinessDetailsFormProps {
  initialName: string;
  initialPhone: string;
  initialProfileImage?: string;
  initialHeadline?: string;
  initialBio?: string;
  initialSocialLinks?: { platform: string; url: string }[];

  orgId: string;
  initialRazorpayKeyId?: string;
  initialRazorpayKeySecret?: string;
}

export function BusinessDetailsForm({ 
  initialName, 
  initialPhone, 
  initialProfileImage,
  initialHeadline,
  initialBio,
  initialSocialLinks,
  orgId, 
  slug, 
  initialRazorpayKeyId, 
  initialRazorpayKeySecret 
}: BusinessDetailsFormProps & { slug: string }) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [profileImage, setProfileImage] = useState(initialProfileImage || "");
  const [headline, setHeadline] = useState(initialHeadline || "");
  const [bio, setBio] = useState(initialBio || "");
  
  // Initialize with 3 empty slots if none exist, or use existing
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>(
    initialSocialLinks && initialSocialLinks.length > 0 
      ? initialSocialLinks 
      : [{ platform: "twitter", url: "" }, { platform: "instagram", url: "" }, { platform: "linkedin", url: "" }]
  );

  const [razorpayKeyId, setRazorpayKeyId] = useState(initialRazorpayKeyId || "");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState(initialRazorpayKeySecret || "");
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const bookingLink = typeof window !== 'undefined' ? `${window.location.origin}/app/${slug}` : `/app/${slug}`;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate Check (Max 2MB, Image types)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 2MB" });
      return;
    }
    
    setIsUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${orgId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('organization-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('organization-assets')
        .getPublicUrl(filePath);

      setProfileImage(publicUrl);
      setMessage({ type: "success", text: "Image uploaded successfully" });
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes("Bucket not found")) {
          setMessage({ type: "error", text: "Storage bucket not found. Please run migrations." });
      } else {
          setMessage({ type: "error", text: "Failed to upload image" });
      }
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialChange = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const addSocialLink = () => {
    if (socialLinks.length < 5) {
      setSocialLinks([...socialLinks, { platform: "website", url: "" }]);
    }
  };

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Filter out empty social links
      const validSocialLinks = socialLinks.filter(link => link.url.trim() !== "");

      // 2. Update Organization Record
      const { error } = await supabase
        .from("organizations")
        .update({ 
            name, 
            phone,
            profile_image_url: profileImage,
            headline,
            bio,
            social_links: validSocialLinks,
            razorpay_key_id: razorpayKeyId,
            razorpay_key_secret: razorpayKeySecret
        })
        .eq("id", orgId);

      if (error) throw error;

      setMessage({ type: "success", text: "Profile updated successfully." });
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
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="grid md:grid-cols-2 gap-4">
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
          </div>

          <div className="border-t pt-4">
             <h3 className="font-semibold text-gray-900 mb-4">Public Profile</h3>
             
             <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="profile-image">Profile Image</Label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {profileImage && (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200 shrink-0">
                             <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                             <button
                               type="button"
                               onClick={() => setProfileImage("")}
                               className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                             >
                               <X className="w-6 h-6" />
                             </button>
                          </div>
                        )}
                        <div className="flex-1 w-full sm:w-auto">
                          <input
                             type="file"
                             ref={fileInputRef}
                             accept="image/*"
                             onChange={handleImageUpload}
                             className="hidden"
                             id="profile-image-upload"
                          />
                          <div className="flex flex-col sm:flex-row gap-2">
                             <Button
                               type="button"
                               variant="outline"
                               onClick={() => fileInputRef.current?.click()}
                               disabled={isUploading}
                               className="w-full sm:w-auto"
                             >
                                {isUploading ? "Uploading..." : "Upload New Image"}
                                <Upload className="ml-2 w-4 h-4" />
                             </Button>
                             {profileImage && (
                                <Input 
                                  value={profileImage} 
                                  readOnly 
                                  className="text-xs text-gray-500 bg-gray-50 flex-1 hidden sm:block"
                                />
                             )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center sm:text-left">Recommended: Square JPG/PNG, Max 2MB.</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                        id="headline"
                        placeholder="e.g. Fitness Coach converting sweat to smiles"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="bio">About / Bio</Label>
                    <textarea
                        id="bio"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tell your clients a bit about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Social Links (Max 5)</Label>
                    {socialLinks.map((link, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-2">
                            <select 
                                className="flex h-10 w-full sm:w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={link.platform}
                                onChange={(e) => handleSocialChange(index, "platform", e.target.value)}
                            >
                                <option value="website">Website</option>
                                <option value="twitter">Twitter/X</option>
                                <option value="instagram">Instagram</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="youtube">YouTube</option>
                                <option value="facebook">Facebook</option>
                                <option value="other">Other</option>
                            </select>
                            <div className="flex gap-2 w-full">
                                <Input
                                    placeholder="https://..."
                                    value={link.url}
                                    onChange={(e) => handleSocialChange(index, "url", e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSocialLink(index)} className="shrink-0">
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {socialLinks.length < 5 && (
                        <Button type="button" variant="outline" onClick={addSocialLink} className="w-fit">
                            Add Social Link
                        </Button>
                    )}
                </div>
             </div>
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
    </div>
  );
}
