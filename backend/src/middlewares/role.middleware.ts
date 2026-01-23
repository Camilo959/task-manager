// src/middlewares/role.middleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        message: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
      return;
    }

    next();
  };
};

/**
 * Middleware específico para solo ADMIN
 */
export const requireAdmin = requireRole(UserRole.ADMIN);

/**
 * Middleware para ADMIN y EDITOR
 */
export const requireEditorOrAdmin = requireRole(UserRole.ADMIN, UserRole.EDITOR);

/**
 * Middleware que permite a cualquier usuario autenticado
 */
export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  next();
};