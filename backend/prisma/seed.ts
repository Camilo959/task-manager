// prisma/seed.ts
import { prisma } from '../src/config/database'; // IMPORTAR tu instancia de database.ts
import { UserRole, TaskStatus } from '../generated/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar datos existentes
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Cleared existing data');

  // Hash de contraseñas
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedEditorPassword = await bcrypt.hash('editor123', 10);
  const hashedUserPassword = await bcrypt.hash('user123', 10);

  // Crear usuarios
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  const editor = await prisma.user.create({
    data: {
      email: 'editor@example.com',
      password: hashedEditorPassword,
      name: 'Editor User',
      role: UserRole.EDITOR,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedUserPassword,
      name: 'Basic User',
      role: UserRole.USER,
    },
  });

  console.log('✅ Created users:', [admin.email, editor.email, user.email]);

  // Crear tareas de ejemplo
  await prisma.task.createMany({
    data: [
      {
        title: 'Setup PostgreSQL Database',
        description: 'Configure PostgreSQL and Prisma for the project',
        status: TaskStatus.DONE,
        createdBy: admin.id,
      },
      {
        title: 'Implement User Authentication',
        description: 'Add JWT authentication with bcrypt password hashing',
        status: TaskStatus.DONE,
        createdBy: admin.id,
      },
      {
        title: 'Build Task CRUD',
        description: 'Create endpoints for task management',
        status: TaskStatus.IN_PROGRESS,
        createdBy: editor.id,
        assignedTo: editor.id,
      },
      {
        title: 'Add Role-Based Permissions',
        description: 'Implement ADMIN, EDITOR, and USER roles with proper permissions',
        status: TaskStatus.IN_PROGRESS,
        createdBy: editor.id,
      },
      {
        title: 'Create Frontend UI',
        description: 'Build React interface with Tailwind CSS',
        status: TaskStatus.TODO,
        createdBy: user.id,
        assignedTo: user.id,
      },
      {
        title: 'Write Documentation',
        description: 'Document API endpoints and setup instructions',
        status: TaskStatus.TODO,
        createdBy: user.id,
      },
    ],
  });

  console.log('✅ Created 6 tasks');
}

// Ejecutar seed
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
