import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { appointmentController } from "@/controllers/appointmentController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    if (session.user.role === "staff" || session.user.role === "admin") {
      return appointmentController.listAll(req);
    }
    return appointmentController.getUserAppointments(req, context, session);
  },
  { requireAuth: true }
);

export const POST = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    return appointmentController.createAppointment(req, context, session);
  },
  { requireAuth: true }
);
