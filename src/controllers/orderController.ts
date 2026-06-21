import { NextRequest } from "next/server";
import { OrderService } from "@/services/OrderService";
import { OrderRepository } from "@/repositories/OrderRepository";
import { ForbiddenError, NotFoundError } from "@/lib/exceptions";

const orderService = new OrderService();
const orderRepository = new OrderRepository();

export class OrderController {
  async createOrder(req: NextRequest, context: any, session: any) {
    const body = await req.json();
    const { items, customerName } = body;
    const userId = session.user.id;

    return orderService.createOrder(userId, customerName || session.user.name, items);
  }

  async getUserOrders(req: NextRequest, context: any, session: any) {
    const userId = session.user.id;
    return orderRepository.findByUser(userId);
  }

  async getOrderById(req: NextRequest, { params }: { params: { id: string } }, session: any) {
    const order = await orderRepository.findById(params.id);
    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    // Authorization: owner, staff or admin
    if (
      order.userId.toString() !== session.user.id &&
      session.user.role !== "staff" &&
      session.user.role !== "admin"
    ) {
      throw new ForbiddenError("You are not authorized to view this order.");
    }

    return order;
  }

  async listAll(req: NextRequest) {
    return orderRepository.listAll();
  }
}
export const orderController = new OrderController();
