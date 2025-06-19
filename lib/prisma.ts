import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient | undefined;

export function isPrismaAvailable(): boolean {
  try {
    // Verifica se estamos em um ambiente de build
    if (process.env.NODE_ENV === 'production' && process.env.SKIP_ENV_VALIDATION) {
      return false;
    }

    // Verifica se a DATABASE_URL está definida
    if (!process.env.DATABASE_URL) {
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Prisma availability check failed:', error);
    return false;
  }
}

function createPrismaClient(): PrismaClient | undefined {
  if (!isPrismaAvailable()) {
    return undefined;
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    return undefined;
  }
}

if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
} else {
  prisma = createPrismaClient();
}

// Função para obter o Prisma de forma segura
export function getPrisma(): PrismaClient | null {
  if (!isPrismaAvailable() || !prisma) {
    return null;
  }
  return prisma;
}

export { prisma };