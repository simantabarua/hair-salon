import { Appointment, IAppointment } from "@/models/Appointment";

export class AppointmentRepository {
  async findById(id: string): Promise<IAppointment | null> {
    return Appointment.findById(id).populate("userId serviceIds stylistId");
  }

  async findByUser(userId: string): Promise<IAppointment[]> {
    return Appointment.find({ userId })
      .populate("serviceIds stylistId")
      .sort({ date: -1, time: -1 });
  }

  async findByStylist(stylistId: string): Promise<IAppointment[]> {
    return Appointment.find({ stylistId })
      .populate("userId serviceIds")
      .sort({ date: -1, time: -1 });
  }

  async findConflicting(
    stylistId: string,
    date: string,
    time: string,
    excludeId?: string
  ): Promise<IAppointment | null> {
    const query: any = {
      stylistId,
      date,
      time,
      status: { $ne: "Cancelled" },
    };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return Appointment.findOne(query);
  }

  async findBookedSlots(date: string, stylistId?: string): Promise<Array<{ time: string; stylistId: string }>> {
    const query: any = { date, status: { $ne: "Cancelled" } };
    if (stylistId) {
      query.stylistId = stylistId;
    }
    const appointments = await Appointment.find(query).select("time stylistId");
    return appointments.map((app) => ({
      time: app.time,
      stylistId: app.stylistId.toString(),
    }));
  }

  async create(appointmentData: Partial<IAppointment>): Promise<IAppointment> {
    const appointment = new Appointment(appointmentData);
    return appointment.save();
  }

  async update(id: string, updateData: Partial<IAppointment>): Promise<IAppointment | null> {
    return Appointment.findByIdAndUpdate(id, { $set: updateData }, { new: true }).populate(
      "userId serviceIds stylistId"
    );
  }

  async listAll(): Promise<IAppointment[]> {
    return Appointment.find()
      .populate("userId serviceIds stylistId")
      .sort({ date: -1, time: -1 });
  }
}
