// src/services/task.service.ts
import type { Task, TaskStatus } from '../types';
import { api } from './api';

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    return api.get<Task[]>('/tasks');
  },

  async getTaskById(id: string): Promise<Task> {
    return api.get<Task>(`/tasks/${id}`);
  },

  async createTask(data: {
    title: string;
    description: string;
    status?: TaskStatus;
  }): Promise<Task> {
    return api.post<Task>('/tasks', data);
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    return api.put<Task>(`/tasks/${id}`, data);
  },

  async deleteTask(id: string): Promise<void> {
    return api.delete(`/tasks/${id}`);
  }
};