import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { blogController } from "@/controllers/blogController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(async (req: NextRequest, context: any) => {
  await connectToDatabase();
  return blogController.getBlogById(req, context);
});

export const PUT = apiHandler(
  async (req: NextRequest, context: any) => {
    await connectToDatabase();
    return blogController.updateBlog(req, context);
  },
  { requireAuth: true, requiredRole: "staff" }
);

export const DELETE = apiHandler(
  async (req: NextRequest, context: any) => {
    await connectToDatabase();
    return blogController.deleteBlog(req, context);
  },
  { requireAuth: true, requiredRole: "staff" }
);
