
// src/routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

// Todas las rutas de usuarios requieren autenticación
router.use(authenticate);

// Solo ADMIN puede gestionar usuarios
router.get('/', requireAdmin, UserController.getAllUsers);
router.post('/', requireAdmin, UserController.createUser);
router.get('/:id', requireAdmin, UserController.getUserById);
router.put('/:id', requireAdmin, UserController.updateUser);
router.delete('/:id', requireAdmin, UserController.deleteUser);

export default router;