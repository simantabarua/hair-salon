import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { appointmentController } from "@/controllers/appointmentController";
import { connectToDatabase } from "@/lib/mongoose";
import { UserRepository } from "@/repositories/UserRepository";
import { AppointmentRepository } from "@/repositories/AppointmentRepository";
import bcrypt from "bcryptjs";

const userRepository = new UserRepository();
const appointmentRepository = new AppointmentRepository();

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
    const body = await req.json().catch(() => ({}));

    // If staff/admin and creating an appointment for someone else by email
    if ((session.user.role === "admin" || session.user.role === "staff") && body.userEmail) {
      let user = await userRepository.findByEmail(body.userEmail);
      if (!user) {
        // Create Guest User
        const hashedPassword = await bcrypt.hash("GuestPass123!", 10);
        user = await userRepository.create({
          name: "Guest Customer",
          email: body.userEmail,
          password: hashedPassword,
          role: "customer"
        });
      }

      // Check stylist conflict
      const conflict = await appointmentRepository.findConflicting(body.stylistId, body.date, body.time);
      if (conflict) {
        return new Response(JSON.stringify({ error: "The selected stylist is already booked at this slot." }), { status: 409 });
      }

      // Create appointment
      const newAppt = await appointmentRepository.create({
        userId: user._id,
        stylistId: body.stylistId,
        serviceIds: body.serviceIds,
        date: body.date,
        time: body.time,
        price: Number(body.price),
        status: body.status || "Confirmed"
      });

      return newAppt;
    }

    return appointmentController.createAppointment(req, context, session, body);
  },
  { requireAuth: true }
);
