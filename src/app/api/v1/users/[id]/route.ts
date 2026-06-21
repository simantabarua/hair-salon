import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { connectToDatabase } from "@/lib/mongoose";
import { UserRepository } from "@/repositories/UserRepository";

const userRepository = new UserRepository();

export const PUT = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    
    // Only staff/admin can edit users
    if (session.user.role !== "admin" && session.user.role !== "staff") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { id } = context.params;
    const body = await req.json();

    const existing = await userRepository.findById(id);
    if (!existing) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const updated = await userRepository.update(id, {
      name: body.name,
      email: body.email,
      role: body.role,
      image: body.image,
      bio: body.bio,
      specialties: Array.isArray(body.specialties) ? body.specialties : typeof body.specialties === "string" ? (body.specialties as string).split(",").map((s: string) => s.trim()) : undefined,
      achievements: Array.isArray(body.achievements) ? body.achievements : typeof body.achievements === "string" ? (body.achievements as string).split(",").map((a: string) => a.trim()) : undefined,
      schedule: body.schedule,
      facebook: body.facebook,
      instagram: body.instagram,
      tiktok: body.tiktok
    });

    return updated;
  },
  { requireAuth: true }
);

export const DELETE = apiHandler(
  async (req: NextRequest, context: any, session: any) => {
    await connectToDatabase();
    
    // Only staff/admin can delete users
    if (session.user.role !== "admin" && session.user.role !== "staff") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { id } = context.params;
    const { User } = require("@/models/User");
    
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return { success: true, message: "User deleted successfully" };
  },
  { requireAuth: true }
);
