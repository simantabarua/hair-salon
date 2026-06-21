import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/apiHandler";
import { connectToDatabase } from "@/lib/mongoose";
import { UserRepository } from "@/repositories/UserRepository";

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
    image: u.image || "/img/Team/team-1.jpg"
  }));

  if (role) {
    return formattedUsers.filter(u => u.role === role);
  }
  
  return formattedUsers;
});
