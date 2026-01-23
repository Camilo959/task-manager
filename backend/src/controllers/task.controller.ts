// src/controllers/task.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest, AuthRequestWithParams } from '../types';
import { TaskService } from '../services/task.service';

export class TaskController {
  static async getAllTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tasks = await TaskService.getAllTasks(req.user!.id, req.user!.role);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: AuthRequestWithParams, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.getTaskById(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  static async createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, description, status } = req.body;

      if (!title || !description) {
        res.status(400).json({ message: 'Title and description are required' });
        return;
      }

      const task = await TaskService.createTask(
        { title, description, status },
        req.user!.id
      );
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: AuthRequestWithParams, res: Response, next: NextFunction) {
    try {
      const updates = req.body;
      const task = await TaskService.updateTask(
        req.params.id,
        updates,
        req.user!.id,
        req.user!.role
      );
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: AuthRequestWithParams, res: Response, next: NextFunction) {
    try {
      TaskService.deleteTask(req.params.id, req.user!.id, req.user!.role);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}