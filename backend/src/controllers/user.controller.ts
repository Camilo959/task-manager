// src/controllers/user.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest, AuthRequestWithParams  } from '../types';
import { UserService } from '../services/user.service';

export class UserController {
  static async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: AuthRequestWithParams, res: Response, next: NextFunction) {
    try {
      const user = UserService.getUserById(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name || !role) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }

      const user = UserService.createUser({ email, password, name, role });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: AuthRequestWithParams, res: Response, next: NextFunction) {
    try {
      const user = UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: AuthRequestWithParams, res: Response, next: NextFunction) {
    try {
      UserService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}