// src/routes/task.routes.ts
import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAuth } from '../middlewares/role.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Cualquier usuario autenticado puede ver y crear tareas
router.get('/', requireAuth, TaskController.getAllTasks);
router.post('/', requireAuth, TaskController.createTask);

// Operaciones sobre tareas específicas
router.get('/:id', requireAuth, TaskController.getTaskById);
router.put('/:id', requireAuth, TaskController.updateTask);
router.delete('/:id', requireAuth, TaskController.deleteTask);

export default router;