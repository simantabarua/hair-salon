import { AppointmentRepository } from "@/repositories/AppointmentRepository";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { IAppointment } from "@/models/Appointment";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "@/lib/exceptions";

export class BookingService {
  private appointmentRepository = new AppointmentRepository();
  private serviceRepository = new ServiceRepository();
  private userRepository = new UserRepository();

  private standardSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  /**
   * Retrieves available time slots for a given date.
   * If stylistId is provided, returns slots where that stylist is free.
   * If stylistId is omitted, returns slots where at least one stylist is free.
   */
  async getAvailableSlots(
    date: string,
    stylistId?: string
  ): Promise<Array<{ time: string; availableStylists: string[] }>> {
    // 1. Fetch all stylists (role: staff or admin)
    const allUsers = await this.userRepository.listAll();
    const stylists = allUsers.filter((u) => u.role === "staff" || u.role === "admin");
    const stylistIds = stylists.map((s) => s._id.toString());

    if (stylistIds.length === 0) {
      return this.standardSlots.map((time) => ({ time, availableStylists: [] }));
    }

    // 2. Fetch booked slots for the date
    const booked = await this.appointmentRepository.findBookedSlots(date, stylistId);

    // 3. Compute availability for each slot
    return this.standardSlots.map((time) => {
      // Find which stylists are booked at this time
      const bookedStylists = booked
        .filter((b) => b.time === time)
        .map((b) => b.stylistId);

      // Available stylists for this slot
      const availableStylists = stylistId
        ? bookedStylists.includes(stylistId)
          ? []
          : [stylistId]
        : stylistIds.filter((id) => !bookedStylists.includes(id));

      return {
        time,
        availableStylists,
      };
    });
  }

  async createAppointment(
    userId: string,
    stylistId: string,
    serviceIds: string[],
    date: string,
    time: string
  ): Promise<IAppointment> {
    if (!stylistId || !serviceIds || serviceIds.length === 0 || !date || !time) {
      throw new BadRequestError("Stylist, services, date, and time are required.");
    }

    if (!this.standardSlots.includes(time)) {
      throw new BadRequestError("Invalid time slot requested.");
    }

    // Check if the stylist is a valid staff/admin user
    const stylist = await this.userRepository.findById(stylistId);
    if (!stylist || (stylist.role !== "staff" && stylist.role !== "admin")) {
      throw new BadRequestError("Selected stylist is not available.");
    }

    // Pre-empt double booking check
    const conflict = await this.appointmentRepository.findConflicting(stylistId, date, time);
    if (conflict) {
      throw new ConflictError("The selected stylist is already booked at this slot.");
    }

    // Calculate total price from services
    let totalPrice = 0;
    for (const serviceId of serviceIds) {
      const service = await this.serviceRepository.findById(serviceId);
      if (!service) {
        throw new NotFoundError(`Service with ID ${serviceId} not found.`);
      }
      totalPrice += service.price;
    }

    // Attempt creation. If concurrent requests pass the pre-empt check, the MongoDB unique index will fail-safe block it.
    try {
      return await this.appointmentRepository.create({
        userId: userId as any,
        stylistId: stylistId as any,
        serviceIds: serviceIds.map((id) => id as any),
        date,
        time,
        price: totalPrice,
        status: "Pending",
      });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictError("Stylist was booked at this time by another client.");
      }
      throw error;
    }
  }

  async cancelAppointment(appointmentId: string, userId: string, userRole: string): Promise<IAppointment> {
    const appointment = await this.appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new NotFoundError("Appointment not found.");
    }

    // Check cancellation authorization: owner, staff or admin
    if (appointment.userId.toString() !== userId && userRole !== "staff" && userRole !== "admin") {
      throw new UnauthorizedError("You are not authorized to cancel this appointment.");
    }

    const updated = await this.appointmentRepository.update(appointmentId, {
      status: "Cancelled",
    });

    if (!updated) {
      throw new NotFoundError("Failed to update appointment.");
    }

    return updated;
  }
}
