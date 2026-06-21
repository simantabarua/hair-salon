import { NextRequest } from "next/server";
import { AuthService } from "@/services/AuthService";

const authService = new AuthService();

export class UserController {
  async register(req: NextRequest) {
    const body = await req.json();
    const { name, email, password } = body;
    return authService.register(name, email, password);
  }
}
export const userController = new UserController();
