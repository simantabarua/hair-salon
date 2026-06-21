import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { serviceController } from "@/controllers/serviceController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(async (req: NextRequest, context: any) => {
  await connectToDatabase();
  return serviceController.getServiceById(req, context);
});

export const PUT = apiHandler(
  async (req: NextRequest, context: any) => {
    await connectToDatabase();
    return serviceController.updateService(req, context);
  },
  { requireAuth: true, requiredRole: "staff" }
);

export const DELETE = apiHandler(
  async (req: NextRequest, context: any) => {
    await connectToDatabase();
    return serviceController.deleteService(req, context);
  },
  { requireAuth: true, requiredRole: "staff" }
);
