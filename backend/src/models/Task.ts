// src/models/Task.ts
import { prisma } from '../config/database';
import { Task, TaskStatus, Prisma } from '../../generated/prisma';

export type TaskWithCreator = Task & {
  creator: {
    id: string;
    name: string;
    email: string;
  };
};

export class TaskModel {
  static async findAll(): Promise<TaskWithCreator[]> {
    return prisma.task.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async findById(id: string): Promise<TaskWithCreator | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  static async findByCreator(creatorId: string): Promise<TaskWithCreator[]> {
    return prisma.task.findMany({
      where: { createdBy: creatorId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async create(data: {
    title: string;
    description: string;
    status: TaskStatus;
    createdBy: string;
    assignedTo?: string;
  }): Promise<Task> {
    return prisma.task.create({
      data
    });
  }

  static async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data
    });
  }

  static async delete(id: string): Promise<Task> {
    return prisma.task.delete({
      where: { id }
    });
  }

  static async deleteByCreator(creatorId: string): Promise<number> {
    const result = await prisma.task.deleteMany({
      where: { createdBy: creatorId }
    });
    return result.count;
  }
}