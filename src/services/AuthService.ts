import { UserRepository } from "@/repositories/UserRepository";
import { IUser } from "@/models/User";
import { BadRequestError, ConflictError } from "@/lib/exceptions";
import bcrypt from "bcryptjs";
import { sanitizeInput } from "@/lib/sanitize";

export class AuthService {
  private userRepository = new UserRepository();

  async register(name: string, email: string, password: string): Promise<Omit<IUser, "password">> {
    if (!name || !email || !password) {
      throw new BadRequestError("Name, email, and password are required.");
    }

    const cleanName = sanitizeInput(name);
    if (!cleanName) {
      throw new BadRequestError("Valid name is required.");
    }

    if (password.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters long.");
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError("Email is already registered.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save user
    const user = await this.userRepository.create({
      name: cleanName,
      email,
      password: hashedPassword,
      role: "customer", 
    });

    const userObj = user.toObject();
    delete (userObj as any).password;
    return userObj;
  }
}
