import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { OrderService } from "@/services/OrderService";
import { stripe } from "@/lib/stripe";
import { connectToDatabase } from "@/lib/mongoose";

const orderService = new OrderService();

export const POST = apiHandler(
  async (req: NextRequest, context, session) => {
    await connectToDatabase();
    const body = await req.json();
    const { items, customerName, discount, shippingMethod } = body;

    if (!items || items.length === 0) {
      throw new Error("Missing items in checkout request.");
    }

    // 1. Create order
    const order = await orderService.createOrder(
      session.user.id,
      customerName || session.user.name || "Customer",
      items
    );

    // 2. Calculate pricing matching the frontend logic
    const discountPercent = discount || 0;
    const discountAmount = order.total * (discountPercent / 100);
    const afterDiscount = order.total - discountAmount;
    
    const shippingCost = shippingMethod === "express" ? 25.0 : (afterDiscount > 150.0 ? 0.0 : 15.0);
    const vatCost = afterDiscount * 0.05;
    const totalCost = afterDiscount + shippingCost + vatCost;
    const amountInCents = Math.round(totalCost * 100);

    // 3. Process payment using Stripe PaymentIntent API with pm_card_visa (immediate confirmation)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      payment_method: "pm_card_visa",
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: {
        orderId: order._id.toString(),
        userId: session.user.id,
      },
    });

    // 4. Update order payment status in Mongoose
    const updatedOrder = await orderService.processOrderPayment(
      order._id.toString(),
      paymentIntent.id,
      "card",
      amountInCents
    );

    return {
      success: true,
      orderId: updatedOrder._id,
      paymentIntentId: paymentIntent.id,
    };
  },
  { requireAuth: true }
);
