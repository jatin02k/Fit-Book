'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrganization(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const razorpayKeyId = formData.get("razorpayKeyId") as string;
  const razorpayKeySecret = formData.get("razorpayKeySecret") as string;
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
    return { error: "Organization not found" };
  }

  const { error: updateError } = await supabase
    .from("organizations")
    .update({
        name,
        phone,
        email, 
        razorpay_key_id: razorpayKeyId || null,
        razorpay_key_secret: razorpayKeySecret || null,
    } as any)
    .eq("id", org.id);

  if (updateError) {
    console.error("Error updating organization:", updateError);
    return { error: "Failed to update details" };
  }

  revalidatePath(`/app/${org.slug}/admin/dashboard/profile`);
  return { success: true };
}
