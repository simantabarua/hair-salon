import { Order, IOrder } from "@/models/Order";
import { ClientSession } from "mongoose";

export class OrderRepository {
  async findById(id: string): Promise<IOrder | null> {
    return Order.findById(id).populate("userId items.productId");
  }

  async findByUser(userId: string): Promise<IOrder[]> {
    return Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });
  }

  async create(orderData: Partial<IOrder>, session?: ClientSession): Promise<IOrder> {
    const order = new Order(orderData);
    if (session) {
      await order.save({ session });
      return order;
    }
    return order.save();
  }

  async update(id: string, updateData: Partial<IOrder>, session?: ClientSession): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, session }
    ).populate("userId items.productId");
  }

  async listAll(): Promise<IOrder[]> {
    return Order.find()
      .populate("userId items.productId")
      .sort({ createdAt: -1 });
  }
}
