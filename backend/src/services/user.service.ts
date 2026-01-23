// src/services/user.service.ts
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { UserRole } from '../../generated/prisma';
import { AppError } from '../middlewares/error.middleware';

export class UserService {
  static async getAllUsers() {
    return UserModel.findAll();
  }

  static async getUserById(userId: string) {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // No retornar la contraseña
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) {
    const existingUser = await UserModel.findByEmail(userData.email);
    
    if (existingUser) {
      throw new AppError(400, 'Email already in use');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await UserModel.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async updateUser(
    userId: string,
    updates: {
      email?: string;
      password?: string;
      name?: string;
      role?: UserRole;
    }
  ) {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Si se actualiza el email, verificar que no exista
    if (updates.email && updates.email !== user.email) {
      const existingUser = await UserModel.findByEmail(updates.email);
      if (existingUser) {
        throw new AppError(400, 'Email already in use');
      }
    }

    // Si se actualiza la contraseña, encriptarla
    const updateData: any = { ...updates };
    if (updates.password) {
      updateData.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await UserModel.update(userId, updateData);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static async deleteUser(userId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Soft delete
    await UserModel.delete(userId);
  }
}