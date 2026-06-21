import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { appointmentController } from "@/controllers/appointmentController";
import { connectToDatabase } from "@/lib/mongoose";
import { AppointmentRepository } from "@/repositories/AppointmentRepository";

const appointmentRepository = new AppointmentRepository();

export const PUT = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));

    // If updating status as staff/admin
    if (body.status && (session.user.role === "admin" || session.user.role === "staff")) {
      const updated = await appointmentRepository.update(context.params.id, {
        status: body.status
      });
      if (!updated) {
        return new Response(JSON.stringify({ error: "Appointment not found" }), { status: 404 });
      }
      return updated;
    }

    return appointmentController.cancelAppointment(req, context, session);
  },
  { requireAuth: true }
);

export const DELETE = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();

    // Only staff/admin can delete appointments
    if (session.user.role !== "admin" && session.user.role !== "staff") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { Appointment } = require("@/models/Appointment");
    const deleted = await Appointment.findByIdAndDelete(context.params.id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Appointment not found" }), { status: 404 });
    }

    return { success: true, message: "Appointment deleted successfully" };
  },
  { requireAuth: true }
);
