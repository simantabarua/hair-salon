import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { connectToDatabase } from "@/lib/mongoose";
import { UserRepository } from "@/repositories/UserRepository";
import bcrypt from "bcryptjs";

const userRepository = new UserRepository();

export const GET = apiHandler(async (req: NextRequest) => {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  
  const allUsers = await userRepository.listAll();
  
  const formattedUsers = allUsers.map(u => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    image: u.image || "/img/Team/team-1.jpg",
    bio: u.bio,
    specialties: u.specialties,
    achievements: u.achievements,
    schedule: u.schedule,
    facebook: u.facebook,
    instagram: u.instagram,
    tiktok: u.tiktok,
  }));

  if (role) {
    return formattedUsers.filter(u => u.role === role);
  }
  
  return formattedUsers;
});

export const POST = apiHandler(
  async (req: NextRequest, _context: any, session: any) => {
    await connectToDatabase();
    
    // Only staff/admin can create users
    if (session.user.role !== "admin" && session.user.role !== "staff") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role, image, bio, specialties, achievements, schedule, facebook, instagram, tiktok } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), { status: 400 });
    }

    // Check if email already exists
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
    }

    // Default password if not provided
    const hashedPassword = await bcrypt.hash(password || "Stylist123!", 10);

    const newUser = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: role || "staff",
      image,
      bio,
      specialties: Array.isArray(specialties) ? specialties : typeof specialties === "string" ? (specialties as string).split(",").map(s => s.trim()) : [],
      achievements: Array.isArray(achievements) ? achievements : typeof achievements === "string" ? (achievements as string).split(",").map(a => a.trim()) : [],
      schedule,
      facebook,
      instagram,
      tiktok
    });

    return newUser;
  },
  { requireAuth: true }
);
