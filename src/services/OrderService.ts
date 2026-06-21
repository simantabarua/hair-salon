import { OrderRepository } from "@/repositories/OrderRepository";
import { ProductRepository } from "@/repositories/ProductRepository";
import { PaymentRepository } from "@/repositories/PaymentRepository";
import { IOrder } from "@/models/Order";
import { BadRequestError, ConflictError, NotFoundError } from "@/lib/exceptions";
import mongoose from "mongoose";

export class OrderService {
  private orderRepository = new OrderRepository();
  private productRepository = new ProductRepository();
  private paymentRepository = new PaymentRepository();

  async createOrder(
    userId: string,
    customerName: string,
    items: Array<{ productId: string; quantity: number }>
  ): Promise<IOrder> {
    if (!items || items.length === 0) {
      throw new BadRequestError("Order must contain at least one item.");
    }

    // Try starting a session for multi-document transaction (fail-safe for standalone MongoDB development)
    let session: mongoose.ClientSession | undefined;
    let useTransaction = false;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      useTransaction = true;
    } catch (e) {
      // Transactions not supported (e.g. local standalone mongo), proceed without transaction safety
      session = undefined;
    }

    try {
      const orderItems = [];
      let total = 0;

      // 1. Process items and decrement stock atomically
      for (const item of items) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          throw new NotFoundError(`Product with ID ${item.productId} not found.`);
        }

        if (product.stock < item.quantity) {
          throw new ConflictError(
            `Insufficient stock for product: ${product.name}. Available: ${product.stock}`
          );
        }

        // Atomically decrement stock
        const decremented = await this.productRepository.decrementStock(
          item.productId,
          item.quantity,
          session
        );

        if (!decremented) {
          throw new ConflictError(
            `Failed to secure stock for product: ${product.name}. Stock might have changed.`
          );
        }

        orderItems.push({
          productId: product._id as any,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });

        total += product.price * item.quantity;
      }

      // 2. Create the order
      const order = await this.orderRepository.create(
        {
          userId: userId as any,
          customerName,
          items: orderItems,
          total,
          paymentStatus: "pending",
          status: "Processing",
        },
        session
      );

      if (useTransaction && session) {
        await session.commitTransaction();
      }

      return order;
    } catch (error) {
      if (useTransaction && session) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      if (session) {
        session.endSession();
      }
    }
  }

  async processOrderPayment(
    orderId: string,
    stripePaymentIntentId: string,
    paymentMethod: string,
    amount: number
  ): Promise<IOrder> {
    let session: mongoose.ClientSession | undefined;
    let useTransaction = false;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      useTransaction = true;
    } catch (e) {
      session = undefined;
    }

    try {
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        throw new NotFoundError("Order not found.");
      }

      // Check if a payment for this Stripe intent already exists
      const existingPayment = await this.paymentRepository.findByStripePaymentIntentId(stripePaymentIntentId);
      if (!existingPayment) {
        // Create payment record
        await this.paymentRepository.create(
          {
            orderId: order._id as any,
            stripePaymentIntentId,
            amount: amount / 100, // Stripe returns cents, convert to main currency unit
            currency: "usd",
            status: "paid",
            paymentMethod,
          },
          session
        );
      }

      // Update Order payment status
      const updatedOrder = await this.orderRepository.update(
        orderId,
        { paymentStatus: "paid" },
        session
      );

      if (!updatedOrder) {
        throw new NotFoundError("Failed to update order payment status.");
      }

      if (useTransaction && session) {
        await session.commitTransaction();
      }

      return updatedOrder;
    } catch (error) {
      if (useTransaction && session) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      if (session) {
        session.endSession();
      }
    }
  }
}
