import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { OrderService } from "@/services/OrderService";
import { OrderRepository } from "@/repositories/OrderRepository";
import { ProductRepository } from "@/repositories/ProductRepository";
import { connectToDatabase } from "@/lib/mongoose";

const orderService = new OrderService();
const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();

// Stripe Webhook needs the raw body to verify signature authenticity
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error("❌ Stripe Webhook Signature Verification Failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const orderId = session.metadata?.orderId;
        const paymentIntentId = session.payment_intent;

        if (orderId && paymentIntentId) {
          // Fetch payment intent to discover payment method detail
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          const paymentMethod = paymentIntent.payment_method_types?.[0] || "card";

          await orderService.processOrderPayment(
            orderId,
            paymentIntentId,
            paymentMethod,
            session.amount_total
          );
          console.log(`✅ Order ${orderId} successfully completed and paid.`);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as any;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const order = await orderRepository.findById(orderId);
          if (order && order.paymentStatus === "pending") {
            // Rollback stock reservations
            console.log(`⏳ Checkout expired for Order ${orderId}. Releasing stock...`);
            for (const item of order.items) {
              await productRepository.incrementStock(item.productId.toString(), item.quantity);
            }
            await orderRepository.update(orderId, {
              paymentStatus: "failed",
              status: "Processing", // Or Cancelled
            });
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled Stripe Webhook Event: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error processing Stripe webhook event:", error);
    return NextResponse.json({ error: "Webhook event processing error" }, { status: 500 });
  }
}

// Next.js Route Handlers configuration (disable body parsing if needed, but in Next.js App Router we read req.text() directly anyway)
export const dynamic = "force-dynamic";
