import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId;
  stylistId: mongoose.Types.ObjectId;
  serviceIds: mongoose.Types.ObjectId[];
  date: string; // format: "YYYY-MM-DD"
  time: string; // format: "HH:MM AM/PM" (e.g. "10:00 AM")
  price: number;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    stylistId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    serviceIds: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }],
    date: { type: String, required: true, index: true },
    time: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce compound unique index on stylist, date, and time for double-booking protection
AppointmentSchema.index({ stylistId: 1, date: 1, time: 1 }, { unique: true });

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);
