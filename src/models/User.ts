import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "customer" | "staff" | "admin";
  image?: string;
  bio?: string;
  specialties?: string[];
  achievements?: string[];
  schedule?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String }, // optional for OAuth users
    role: {
      type: String,
      enum: ["customer", "staff", "admin"],
      default: "customer",
      index: true,
    },
    image: { type: String },
    bio: { type: String },
    specialties: [{ type: String }],
    achievements: [{ type: String }],
    schedule: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    tiktok: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: any) {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
