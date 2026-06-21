import { Payment, IPayment } from "@/models/Payment";
import { ClientSession } from "mongoose";

export class PaymentRepository {
  async findById(id: string): Promise<IPayment | null> {
    return Payment.findById(id).populate("orderId");
  }

  async findByOrderId(orderId: string): Promise<IPayment | null> {
    return Payment.findOne({ orderId });
  }

  async findByStripePaymentIntentId(stripePaymentIntentId: string): Promise<IPayment | null> {
    return Payment.findOne({ stripePaymentIntentId });
  }

  async create(paymentData: Partial<IPayment>, session?: ClientSession): Promise<IPayment> {
    const payment = new Payment(paymentData);
    if (session) {
      await payment.save({ session });
      return payment;
    }
    return payment.save();
  }

  async updateStatus(
    stripePaymentIntentId: string,
    status: "pending" | "paid" | "failed" | "refunded",
    session?: ClientSession
  ): Promise<IPayment | null> {
    return Payment.findOneAndUpdate(
      { stripePaymentIntentId },
      { $set: { status } },
      { new: true, session }
    );
  }
}
