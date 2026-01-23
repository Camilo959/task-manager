// src/services/user.service.ts
import type { User } from '../types';
import { api } from './api';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: string;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    return api.get<User[]>('/users');
  },

  async getUserById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  async createUser(data: CreateUserInput): Promise<User> {
    return api.post<User>('/users', data);
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return api.put<User>(`/users/${id}`, data);
  },

  async deleteUser(id: string): Promise<void> {
    return api.delete(`/users/${id}`);
  }
};