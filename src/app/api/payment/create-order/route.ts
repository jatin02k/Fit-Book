import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const { serviceId } = await request.json();
    const supabase = await createClient();

    // 1. Get Service Price & Organization Keys
    const { data: service } = await supabase
      .from("services")
      .select("price, organizations(id, razorpay_key_id, razorpay_key_secret)")
      .eq("id", serviceId)
      .single();

    if (!service) {
      console.error("Service not found for ID:", serviceId);
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    interface ServiceWithOrg {
        price: number;
        organizations: {
            id: string;
            razorpay_key_id: string | null;
            razorpay_key_secret: string | null;
        } | {
            id: string;
            razorpay_key_id: string | null;
            razorpay_key_secret: string | null;
        }[] | null;
    }

    const serviceData = service as unknown as ServiceWithOrg;
    // Handle array or object result from join
    const org = Array.isArray(serviceData.organizations) 
        ? serviceData.organizations[0] 
        : serviceData.organizations;

    console.log("Debug Payment: Org Data", { 
        orgId: org?.id, 
        hasKeyId: !!org?.razorpay_key_id, 
        hasSecret: !!org?.razorpay_key_secret 
    });

    const key_id = org?.razorpay_key_id;
    const key_secret = org?.razorpay_key_secret;

    if (!key_id || !key_secret) {
      console.error("Missing keys for org:", org?.id);
      return NextResponse.json({ error: "Payment gateway not configured for this business" }, { status: 400 });
    }

    // 2. Create Razorpay Instance
    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // 3. Create Order
    const options = {
      amount: service.price * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: key_id 
    });

  } catch (error: unknown) {
    console.error("Error creating order:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
