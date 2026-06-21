import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { reviewController } from "@/controllers/reviewController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  return reviewController.getReviews(req);
});

export const POST = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    return reviewController.createReview(req, context, session);
  },
  { requireAuth: true }
);
