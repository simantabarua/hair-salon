import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  category: string;
  description: string;
  tags: string[];
  stock: number;
  minStock: number;
  sku: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    minStock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: any) {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create compound text index on name and description for search support
ProductSchema.index({ name: "text", description: "text" });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
