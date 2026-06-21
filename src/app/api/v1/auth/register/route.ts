import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { userController } from "@/controllers/userController";
import { rateLimiter } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/mongoose";

// Allow 5 registration attempts per 15 minutes per IP
const registerLimiter = rateLimiter({
  limit: 5,
  windowMs: 15 * 60 * 1000,
});

export const POST = apiHandler(
  async (req: NextRequest) => {
    await connectToDatabase();

    // Enforce rate limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limitResult = registerLimiter(ip);

    if (!limitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many registration attempts. Please try again in 15 minutes.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((limitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    return userController.register(req);
  },
  { requireAuth: false }
);
