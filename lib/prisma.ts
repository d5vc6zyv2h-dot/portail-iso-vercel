
import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";

const rawDatabaseUrl = process.env.DATABASE_URL?.trim();

if (!rawDatabaseUrl) {
  throw new Error("DATABASE_URL n'est pas définie.");
}

const databaseUrl = rawDatabaseUrl.replace(/^["']|["']$/g, "");

try {
  new URL(databaseUrl);
} catch {
  throw new Error("DATABASE_URL contient une URL invalide.");
}

const adapter = new PrismaTiDBCloud({
  url: databaseUrl,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

