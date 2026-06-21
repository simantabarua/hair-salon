import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { orderController } from "@/controllers/orderController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    if (session.user.role === "staff" || session.user.role === "admin") {
      return orderController.listAll(req);
    }
    return orderController.getUserOrders(req, context, session);
  },
  { requireAuth: true }
);

export const POST = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    return orderController.createOrder(req, context, session);
  },
  { requireAuth: true }
);
