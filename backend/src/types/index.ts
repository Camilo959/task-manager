// src/types/index.ts
import { Request } from 'express';
import { UserRole as PrismaUserRole, TaskStatus as PrismaTaskStatus } from '../../generated/prisma';

// Re-exportar enums de Prisma para consistencia
export { UserRole, TaskStatus } from '../../generated/prisma';

// Tipos personalizados
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: PrismaUserRole;
  };
}

export interface AuthRequestWithParams extends AuthRequest {
  params: { id: string };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: PrismaUserRole;
}

// DTOs para respuestas
export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: PrismaUserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: PrismaTaskStatus;
  createdBy: string;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: PrismaUserRole;
  };
}

// DTOs para requests
export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role: PrismaUserRole;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  name?: string;
  role?: PrismaUserRole;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: PrismaTaskStatus;
  assignedTo?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: PrismaTaskStatus;
  assignedTo?: string;
}