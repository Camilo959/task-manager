// src/models/User.ts
import { prisma } from '../config/database';
import { User, Prisma } from '../../generated/prisma';

export class UserModel {
  static async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: false
      }
    });
    return users;
  }

  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  static async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data
    });
  }

  static async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  static async delete(id: string): Promise<User> {
    // Soft delete - marcamos como inactivo
    return prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
  }

  static async hardDelete(id: string): Promise<User> {
    // Hard delete - elimina permanentemente
    return prisma.user.delete({
      where: { id }
    });
  }
}