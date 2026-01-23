// src/services/task.service.ts
import { TaskModel, TaskWithCreator } from '../models/Task';
import { TaskStatus, UserRole } from '../../generated/prisma';
import { AppError } from '../middlewares/error.middleware';

export class TaskService {
  static async getAllTasks(userId: string, userRole: UserRole): Promise<TaskWithCreator[]> {
    // ADMIN y EDITOR ven todas las tareas
    if (userRole === UserRole.ADMIN || userRole === UserRole.EDITOR) {
      return TaskModel.findAll();
    }
    
    // USER solo ve sus propias tareas
    return TaskModel.findByCreator(userId);
  }

  static async getTaskById(taskId: string, userId: string, userRole: UserRole): Promise<TaskWithCreator> {
    const task = await TaskModel.findById(taskId);
    
    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    // USER solo puede ver sus propias tareas
    if (userRole === UserRole.USER && task.createdBy !== userId) {
      throw new AppError(403, 'Access denied');
    }

    return task;
  }

  static async createTask(
    taskData: { title: string; description: string; status?: TaskStatus; assignedTo?: string },
    userId: string
  ) {
    return TaskModel.create({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || TaskStatus.TODO,
      createdBy: userId,
      assignedTo: taskData.assignedTo
    });
  }

  static async updateTask(
    taskId: string,
    updates: { title?: string; description?: string; status?: TaskStatus; assignedTo?: string },
    userId: string,
    userRole: UserRole
  ) {
    const task = await TaskModel.findById(taskId);
    
    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    // USER solo puede editar sus propias tareas
    if (userRole === UserRole.USER && task.createdBy !== userId) {
      throw new AppError(403, 'You can only edit your own tasks');
    }

    return TaskModel.update(taskId, updates);
  }

  static async deleteTask(taskId: string, userId: string, userRole: UserRole): Promise<void> {
    const task = await TaskModel.findById(taskId);
    
    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    // Solo ADMIN puede eliminar cualquier tarea
    // EDITOR y USER solo pueden eliminar sus propias tareas
    if (userRole !== UserRole.ADMIN && task.createdBy !== userId) {
      throw new AppError(403, 'Insufficient permissions to delete this task');
    }

    await TaskModel.delete(taskId);
  }
}