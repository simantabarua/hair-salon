import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { productController } from "@/controllers/productController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  return productController.getProducts(req);
});

export const POST = apiHandler(
  async (req: NextRequest) => {
    await connectToDatabase();
    return productController.createProduct(req);
  },
  { requireAuth: true, requiredRole: "staff" }
);
