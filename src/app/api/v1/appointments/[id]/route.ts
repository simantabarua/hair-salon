import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { appointmentController } from "@/controllers/appointmentController";
import { connectToDatabase } from "@/lib/mongoose";

export const PUT = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    return appointmentController.cancelAppointment(req, context, session);
  },
  { requireAuth: true }
);
