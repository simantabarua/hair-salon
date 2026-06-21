import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { orderController } from "@/controllers/orderController";
import { connectToDatabase } from "@/lib/mongoose";
import { OrderRepository } from "@/repositories/OrderRepository";

const orderRepository = new OrderRepository();

export const GET = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    return orderController.getOrderById(req, context, session);
  },
  { requireAuth: true }
);

export const PUT = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    
    // Only staff/admin can update orders
    if (session.user.role !== "admin" && session.user.role !== "staff") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { id } = context.params;
    const body = await req.json();

    const updated = await orderRepository.update(id, {
      status: body.status,
      paymentStatus: body.paymentStatus
    });

    if (!updated) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    return updated;
  },
  { requireAuth: true }
);
