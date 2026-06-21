import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { appointmentController } from "@/controllers/appointmentController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  return appointmentController.getAvailableSlots(req);
});
