import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const headersList = await headers();
    const signature = headersList.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
        return NextResponse.json({ error: "Missing secret or signature" }, { status: 400 });
    }

    // Verify Signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(rawBody);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const entity = payload.payload.subscription ? payload.payload.subscription.entity : payload.payload.payment?.entity;
    
    // We stored organization_id in notes when creating subscription, BUT
    // Razorpay subscription entity notes might not always be directly available in the same structure depending on event.
    // Ideally we rely on subscription_id matching.
    
    const subscriptionId = entity?.id;
    const supabase = await createClient();

    let newStatus = '';

    switch (event) {
      case "subscription.activated":
      case "subscription.charged":
        newStatus = "active";
        break;
      case "subscription.cancelled":
      case "subscription.halted":
      case "subscription.paused":
      case "subscription.pending":
        newStatus = "inactive";
        break;
      case "order.paid":
        // Handle One-Time Payment webhook as duplicate protection or async confirm
        // For now we just log it, or we could update an appointment if we stored it as 'pending' first.
        // Current flow inserts as 'confirmed' directly on API.
        // If we want robust async, we should insert 'pending' then update here.
        // For this immediate task, we will just log success to show we receive it.
        console.log("Webhook: Order Paid", payload.payload.order.entity.id);
        return NextResponse.json({ status: "ok" });
    }

    if (newStatus) {
       // Find organization by subscription_id
       // Note: Since we need to find WHICH organization has this subscription_id
       // We can just update directly where subscription_id matches.
       
       const { error } = await supabase
         .from("organizations")
         .update({ subscription_status: newStatus })
         .eq("subscription_id", subscriptionId);

       if (error) {
         console.error(`Error updating status for sub ${subscriptionId}:`, error);
         return NextResponse.json({ error: "Database update failed" }, { status: 500 });
       }
    }

    return NextResponse.json({ status: "ok" });

  } catch (error: unknown) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
