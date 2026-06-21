import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    stripePaymentIntentId: { type: String, required: true, unique: true, trim: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "usd", lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentMethod: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
