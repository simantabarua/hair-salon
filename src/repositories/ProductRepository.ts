import { Product, IProduct } from "@/models/Product";
import { ClientSession } from "mongoose";

export interface ProductFilterOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  includeDeleted?: boolean;
}

export class ProductRepository {
  async findById(id: string, includeDeleted = false): Promise<IProduct | null> {
    const query: any = { _id: id };
    if (!includeDeleted) {
      query.isDeleted = { $ne: true };
    }
    return Product.findOne(query);
  }

  async findBySku(sku: string, includeDeleted = false): Promise<IProduct | null> {
    const query: any = { sku: sku.toUpperCase() };
    if (!includeDeleted) {
      query.isDeleted = { $ne: true };
    }
    return Product.findOne(query);
  }

  async findAll(options: ProductFilterOptions = {}): Promise<{ products: IProduct[]; total: number }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (!options.includeDeleted) {
      query.isDeleted = { $ne: true };
    }
    if (options.category) {
      query.category = options.category;
    }
    if (options.search) {
      query.$text = { $search: options.search };
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(options.search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return { products, total };
  }

  async create(productData: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(productData);
    return product.save();
  }

  async update(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: updateData },
      { new: true }
    );
  }

  async deleteSoft(id: string): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
  }

  /**
   * Decrements stock atomically.
   * Ensures that stock cannot fall below 0 or the minimum stock threshold (or simply stock >= quantity).
   * Returns true if the decrement was successful, false otherwise.
   */
  async decrementStock(
    id: string,
    quantity: number,
    session?: ClientSession
  ): Promise<boolean> {
    const result = await Product.updateOne(
      { _id: id, stock: { $gte: quantity }, isDeleted: { $ne: true } },
      { $inc: { stock: -quantity } },
      { session }
    );
    return result.modifiedCount > 0;
  }

  async incrementStock(
    id: string,
    quantity: number,
    session?: ClientSession
  ): Promise<boolean> {
    const result = await Product.updateOne(
      { _id: id },
      { $inc: { stock: quantity } },
      { session }
    );
    return result.modifiedCount > 0;
  }
}
