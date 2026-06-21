import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { serviceController } from "@/controllers/serviceController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  return serviceController.getServices(req);
});

export const POST = apiHandler(
  async (req: NextRequest) => {
    await connectToDatabase();
    return serviceController.createService(req);
  },
  { requireAuth: true, requiredRole: "staff" }
);
