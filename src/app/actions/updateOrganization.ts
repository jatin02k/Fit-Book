'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrganization(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  // const email = formData.get("email") as string; // Removed email from update to avoid conflict or need for verification logic if not intended.
  const profile_image_url = formData.get("profile_image_url") as string;
  const headline = formData.get("headline") as string;
  const bio = formData.get("bio") as string;
  const social_links_raw = formData.get("social_links") as string;
  const razorpayKeyId = formData.get("razorpay_key_id") as string;
  const razorpayKeySecret = formData.get("razorpay_key_secret") as string;

  let social_links = [];
  try {
      social_links = JSON.parse(social_links_raw || '[]');
  } catch (e) {
      console.error("Failed to parse social links", e);
  }

  // Slug is not editable to prevent URL breakage
  // Subscription status is read-only here

  if (!name) {
    return { error: "Business Name is required" };
  }

  // Verify Organization ownership
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("id, slug")
    .eq("owner_id", user.id)
    .single();

  if (orgError || !org) {
    console.error("Org fetch error:", orgError);
    return { error: "Organization not found" };
  }

  const { error: updateError } = await supabase
    .from("organizations")
    .update({
        name,
        phone,
        profile_image_url,
        headline,
        bio,
        social_links,
        razorpay_key_id: razorpayKeyId || null,
        razorpay_key_secret: razorpayKeySecret || null,
    })
    .eq("id", org.id);

  if (updateError) {
    console.error("Error updating organization:", updateError);
    return { error: "Failed to update details" };
  }

  revalidatePath(`/app/${org.slug}/admin/dashboard/profile`);
  return { success: true };
}
