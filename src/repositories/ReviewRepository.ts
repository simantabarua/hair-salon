import { Review, IReview } from "@/models/Review";

export class ReviewRepository {
  async findById(id: string): Promise<IReview | null> {
    return Review.findById(id).populate("userId");
  }

  async findByTarget(targetId: string, targetType: "product" | "service" | "stylist"): Promise<IReview[]> {
    return Review.find({ targetId, targetType, status: "approved" })
      .populate("userId", "name image")
      .sort({ createdAt: -1 });
  }

  async findByUserAndTarget(userId: string, targetId: string): Promise<IReview | null> {
    return Review.findOne({ userId, targetId });
  }

  async create(reviewData: Partial<IReview>): Promise<IReview> {
    const review = new Review(reviewData);
    return review.save();
  }

  async updateStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<IReview | null> {
    return Review.findByIdAndUpdate(id, { $set: { status } }, { new: true });
  }

  async getAverageRating(targetId: string): Promise<{ average: number; count: number }> {
    const stats = await Review.aggregate([
      { $match: { targetId: new mongoose.Types.ObjectId(targetId), status: "approved" } },
      {
        $group: {
          _id: "$targetId",
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return { average: 5, count: 0 };
    }

    return {
      average: Math.round(stats[0].averageRating * 10) / 10,
      count: stats[0].count,
    };
  }
}

import mongoose from "mongoose";
