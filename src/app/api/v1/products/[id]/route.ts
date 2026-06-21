import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { productController } from "@/controllers/productController";
import { connectToDatabase } from "@/lib/mongoose";

export const GET = apiHandler(async (req: NextRequest, context: any) => {
  await connectToDatabase();
  return productController.getProductById(req, context);
});

export const PUT = apiHandler(
  async (req: NextRequest, context: any) => {
    await connectToDatabase();
    return productController.updateProduct(req, context);
  },
  { requireAuth: true, requiredRole: "staff" }
);

export const DELETE = apiHandler(
  async (req: NextRequest, context: any) => {
    await connectToDatabase();
    return productController.deleteProduct(req, context);
  },
  { requireAuth: true, requiredRole: "staff" }
);
