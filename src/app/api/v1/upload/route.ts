import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { env } from "@/lib/env";
import { v2 as cloudinary } from "cloudinary";
import { BadRequestError } from "@/lib/exceptions";

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const POST = apiHandler(
  async (req: NextRequest) => {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      throw new BadRequestError("No file uploaded.");
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload stream to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "hair-salon",
            allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
            resource_type: "image",
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    }) as any;

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    };
  },
  { requireAuth: true, requiredRole: "staff" } // Only staff and admin can upload
);
