import { NextRequest } from "next/server";
import { ReviewService } from "@/services/ReviewService";
import { ReviewRepository } from "@/repositories/ReviewRepository";
import { BadRequestError } from "@/lib/exceptions";

const reviewService = new ReviewService();
const reviewRepository = new ReviewRepository();

export class ReviewController {
  async createReview(req: NextRequest, context: any, session: any) {
    const body = await req.json();
    const { rating, comment, targetType, targetId } = body;
    const userId = session.user.id;
    const userName = session.user.name || "Anonymous";

    return reviewService.createReview(userId, userName, rating, comment, targetType, targetId);
  }

  async getReviews(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");
    const targetType = searchParams.get("targetType") as any;

    if (!targetId || !targetType) {
      throw new BadRequestError("Both targetId and targetType are required queries.");
    }

    return reviewRepository.findByTarget(targetId, targetType);
  }
}
export const reviewController = new ReviewController();
