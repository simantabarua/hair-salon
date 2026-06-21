import { NextRequest } from "next/server";
import { BookingService } from "@/services/BookingService";
import { AppointmentRepository } from "@/repositories/AppointmentRepository";
import { BadRequestError } from "@/lib/exceptions";

const bookingService = new BookingService();
const appointmentRepository = new AppointmentRepository();

export class AppointmentController {
  async getAvailableSlots(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const stylistId = searchParams.get("stylistId") || undefined;

    if (!date) {
      throw new BadRequestError("Date parameter is required (format: YYYY-MM-DD).");
    }

    return bookingService.getAvailableSlots(date, stylistId);
  }

  async createAppointment(req: NextRequest, context: any, session: any, parsedBody?: any) {
    const body = parsedBody || await req.json();
    const { stylistId, serviceIds, date, time } = body;
    const userId = session.user.id;

    return bookingService.createAppointment(userId, stylistId, serviceIds, date, time);
  }

  async getUserAppointments(req: NextRequest, context: any, session: any) {
    const userId = session.user.id;
    return appointmentRepository.findByUser(userId);
  }

  async cancelAppointment(req: NextRequest, { params }: { params: { id: string } }, session: any) {
    const userId = session.user.id;
    const userRole = session.user.role;

    return bookingService.cancelAppointment(params.id, userId, userRole);
  }

  async listAll(req: NextRequest) {
    return appointmentRepository.listAll();
  }
}
export const appointmentController = new AppointmentController();
