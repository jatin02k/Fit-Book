import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(_request: Request) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id, email, name")
      .eq("owner_id", user.id)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const planId = process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID;

    if (!planId) {
      console.error("NEXT_PUBLIC_RAZORPAY_PLAN_ID is not defined");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Create Subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120, // 10 years (indefinite-ish)
      quantity: 1,
      notes: {
        organization_id: org.id,
      },
    });

    if (!subscription) {
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }

    // Update organization with new subscription ID
    // We don't change status yet, webhook will handle 'active'
    // But we might want to store the ID so we know what to look for
    const { error: updateError } = await supabase
      .from("organizations")
      .update({
        subscription_id: subscription.id,
        subscription_status: 'inactive'
      })
      .eq("id", org.id);

    if (updateError) {
      console.error("Error updating organization:", updateError);
      return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
    }

    return NextResponse.json({
        subscription_id: subscription.id,
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });

  } catch (error: unknown) {
    console.error("Error creating subscription:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
