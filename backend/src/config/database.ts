// src/config/database.ts
import "dotenv/config";
import { PrismaClient } from '../../generated/prisma';
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
    throw new Error("❌ DATABASE_URL is not set in .env");
}

// Creamos el adapter de PostgreSQL
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Singleton pattern para Prisma Client (evita múltiples instancias en dev con hot reload)
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

// Función opcional para conectar a la base de datos
export const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};

// Función opcional para desconectar
export const disconnectDatabase = async () => {
    await prisma.$disconnect();
    console.log("Database disconnected");
};

// Manejo de señales para graceful shutdown
process.on("SIGINT", async () => {
    await disconnectDatabase();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await disconnectDatabase();
    process.exit(0);
});
