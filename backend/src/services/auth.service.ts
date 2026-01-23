// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { generateToken } from '../utils/jwt.util';
import { AppError } from '../middlewares/error.middleware';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email);
    
    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Verificar contraseña con bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  static async register(data: {
    email: string;
    password: string;
    name: string;
  }) {
    const existingUser = await UserModel.findByEmail(data.email);
    
    if (existingUser) {
      throw new AppError(400, 'Email already in use');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserModel.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: 'USER' // Por defecto USER
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
}