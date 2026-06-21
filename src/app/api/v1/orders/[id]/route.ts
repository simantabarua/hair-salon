import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { orderController } from "@/controllers/orderController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    return orderController.getOrderById(req, context, session);
  },
  { requireAuth: true }
);
