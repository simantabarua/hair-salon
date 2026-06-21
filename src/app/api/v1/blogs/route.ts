import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { blogController } from "@/controllers/blogController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  return blogController.getBlogs(req);
});

export const POST = apiHandler(
  async (req: NextRequest) => {
    await connectToDatabase();
    return blogController.createBlog(req);
  },
  { requireAuth: true, requiredRole: "staff" }
);
