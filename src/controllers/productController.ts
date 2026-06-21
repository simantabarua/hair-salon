import { NextRequest } from "next/server";
import { ProductRepository } from "@/repositories/ProductRepository";
import { NotFoundError } from "@/lib/exceptions";

const productRepository = new ProductRepository();

export class ProductController {
  async getProducts(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    return productRepository.findAll({
      search,
      category,
      page,
      limit,
    });
  }

  async getProductById(req: NextRequest, { params }: { params: { id: string } }) {
    const product = await productRepository.findById(params.id);
    if (!product) {
      throw new NotFoundError("Product not found.");
    }
    return product;
  }

  async createProduct(req: NextRequest) {
    const body = await req.json();
    return productRepository.create(body);
  }

  async updateProduct(req: NextRequest, { params }: { params: { id: string } }) {
    const body = await req.json();
    const updated = await productRepository.update(params.id, body);
    if (!updated) {
      throw new NotFoundError("Product not found.");
    }
    return updated;
  }

  async deleteProduct(req: NextRequest, { params }: { params: { id: string } }) {
    const deleted = await productRepository.deleteSoft(params.id);
    if (!deleted) {
      throw new NotFoundError("Product not found.");
    }
    return { success: true, message: "Product deleted successfully." };
  }
}
export const productController = new ProductController();
