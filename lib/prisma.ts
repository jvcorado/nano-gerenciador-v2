import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Só instancia o Prisma se a DATABASE_URL estiver disponível
const createPrismaClient = (): PrismaClient | null => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL não encontrada, Prisma não será inicializado');
    return null;
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Só adiciona ao global se o prisma foi criado e não estamos em produção
if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

// Função para verificar se o Prisma está disponível
export const isPrismaAvailable = (): boolean => {
  return prisma !== null && !!process.env.DATABASE_URL;
};

// Função que garante que o prisma não é null
export const getPrisma = (): PrismaClient => {
  if (!prisma) {
    throw new Error('Prisma não está disponível. Verifique se DATABASE_URL está configurada.');
  }
  return prisma;
};

// Wrapper para operações do Prisma que podem falhar durante build
export const safePrismaOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!isPrismaAvailable()) {
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    console.error('Erro na operação do Prisma:', error);
    return fallback;
  }
};