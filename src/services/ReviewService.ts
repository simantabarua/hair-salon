import { ReviewRepository } from "@/repositories/ReviewRepository";
import { ProductRepository } from "@/repositories/ProductRepository";
import { OrderRepository } from "@/repositories/OrderRepository";
import { AppointmentRepository } from "@/repositories/AppointmentRepository";
import { IReview } from "@/models/Review";
import { BadRequestError, ConflictError } from "@/lib/exceptions";
import { sanitizeInput } from "@/lib/sanitize";

export class ReviewService {
  private reviewRepository = new ReviewRepository();
  private productRepository = new ProductRepository();
  private orderRepository = new OrderRepository();
  private appointmentRepository = new AppointmentRepository();

  async createReview(
    userId: string,
    userName: string,
    rating: number,
    comment: string,
    targetType: "product" | "service" | "stylist",
    targetId: string
  ): Promise<IReview> {
    if (!rating || rating < 1 || rating > 5 || !comment || !targetType || !targetId) {
      throw new BadRequestError("Rating (1-5), comment, targetType, and targetId are required.");
    }

    // Spam check: check if user already reviewed this target
    const existing = await this.reviewRepository.findByUserAndTarget(userId, targetId);
    if (existing) {
      throw new ConflictError("You have already reviewed this item.");
    }

    // Verify purchase/appointment rules
    if (targetType === "product") {
      const orders = await this.orderRepository.findByUser(userId);
      const hasPurchased = orders.some(
        (order) =>
          order.paymentStatus === "paid" &&
          order.items.some((item) => item.productId.toString() === targetId)
      );
      if (!hasPurchased) {
        throw new BadRequestError("You must purchase this product before writing a review.");
      }
    } else if (targetType === "service") {
      const appointments = await this.appointmentRepository.findByUser(userId);
      const hasCompleted = appointments.some(
        (app) =>
          app.status === "Confirmed" &&
          app.serviceIds.some((id) => id.toString() === targetId)
      );
      if (!hasCompleted) {
        throw new BadRequestError("You must complete an appointment for this service before writing a review.");
      }
    } else if (targetType === "stylist") {
      const appointments = await this.appointmentRepository.findByUser(userId);
      const hasVisited = appointments.some(
        (app) => app.status === "Confirmed" && app.stylistId.toString() === targetId
      );
      if (!hasVisited) {
        throw new BadRequestError("You must complete an appointment with this stylist before writing a review.");
      }
    }

    // Create review
    const review = await this.reviewRepository.create({
      userId: userId as any,
      userName,
      rating,
      comment: sanitizeInput(comment),
      targetType,
      targetId: targetId as any,
      status: "approved", // auto approve for now
    });

    // If target is a product, recalculate its average rating and count
    if (targetType === "product") {
      await this.syncProductRating(targetId);
    }

    return review;
  }

  async approveReview(id: string): Promise<IReview | null> {
    const review = await this.reviewRepository.updateStatus(id, "approved");
    if (review && review.targetType === "product") {
      await this.syncProductRating(review.targetId.toString());
    }
    return review;
  }

  async rejectReview(id: string): Promise<IReview | null> {
    const review = await this.reviewRepository.updateStatus(id, "rejected");
    if (review && review.targetType === "product") {
      await this.syncProductRating(review.targetId.toString());
    }
    return review;
  }

  private async syncProductRating(productId: string): Promise<void> {
    const { average, count } = await this.reviewRepository.getAverageRating(productId);
    await this.productRepository.update(productId, {
      rating: average,
      ratingCount: count,
    });
  }
}
