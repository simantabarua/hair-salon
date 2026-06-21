import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { OrderService } from "@/services/OrderService";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { connectToDatabase } from "@/lib/mongoose";

const orderService = new OrderService();

export const POST = apiHandler(
  async (req: NextRequest, context, session) => {
    await connectToDatabase();
    const body = await req.json();
    const { items, customerName } = body;

    if (!items || items.length === 0) {
      throw new Error("Missing items in checkout request.");
    }

    const order = await orderService.createOrder(
      session.user.id,
      customerName || session.user.name || "Customer",
      items
    );

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: session.user.email || undefined,
      success_url: `${env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${env.NEXTAUTH_URL}/checkout/cancel?order_id=${order._id}`,
      metadata: {
        orderId: order._id.toString(),
        userId: session.user.id,
      },
    });

    return {
      sessionId: stripeSession.id,
      url: stripeSession.url,
      orderId: order._id,
    };
  },
  { requireAuth: true }
);
