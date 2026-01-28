// src/types/index.ts
export const UserRole = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  USER: 'USER'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface User {
  id: string; // Ahora es UUID en lugar de número
  email: string;
  name: string;
  role: UserRole;
  isActive?: boolean; // Nuevo campo
  createdAt: string;
  updatedAt?: string; // Nuevo campo
}

export interface Task {
  id: string; // Ahora es UUID en lugar de número
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: string; // UUID
  assignedTo?: string | null; // Puede ser null
  createdAt: string;
  updatedAt: string;
  // Información del creador (viene del include de Prisma)
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  // Información del asignado (opcional)
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
