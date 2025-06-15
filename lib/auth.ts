import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { Plan, UserRole } from '@prisma/client';

// Importação condicional do Prisma
let prisma: any;
let PrismaAdapter: any;

// Só importa o Prisma se a DATABASE_URL estiver disponível
if (process.env.DATABASE_URL) {
  prisma = require('@/lib/prisma').prisma;
  PrismaAdapter = require('@next-auth/prisma-adapter').PrismaAdapter;
}

// Função para verificar se o banco está disponível
const isDatabaseAvailable = () => {
  return process.env.DATABASE_URL && prisma && PrismaAdapter;
};

export const authOptions: NextAuthOptions = {
  // Só use o adapter se o banco estiver disponível
  ...(isDatabaseAvailable() && { adapter: PrismaAdapter(prisma) }),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Skip database operations se não estiver disponível
      if (!isDatabaseAvailable()) {
        return true;
      }

      if (!user.email) return false;

      try {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { tenant: true },
        });

        if (dbUser && account) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          // Se a conta OAuth não estiver registrada, criamos ela manualmente
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                scope: account.scope,
                expires_at: account.expires_at,
                session_state: account.session_state,
              },
            });
          }
        }

        // Se o usuário ainda não existe (primeiro login), criamos
        if (!dbUser) {
          const newTenant = await prisma.tenant.create({
            data: {
              name: user.name || 'Nova Empresa',
              email: user.email!,
              company: 'Empresa Starter',
              isActive: true,
              plan: Plan.STARTER,
            },
          });

          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              tenantId: newTenant.id,
            },
            include: { tenant: true },
          });
        }

        if (!dbUser.tenantId || !dbUser.tenant) return false;

        return dbUser.tenant.isActive;
      } catch (error) {
        console.error('Erro no signIn callback:', error);
        return false;
      }
    },

    async jwt({ token, user }) {
      // Skip database operations se não estiver disponível
      if (!isDatabaseAvailable()) {
        return token;
      }

      if (user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { tenant: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.tenantId = dbUser.tenantId ?? undefined;
            token.plan = dbUser.tenant?.plan;
          }
        } catch (error) {
          console.error('Erro no JWT callback:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.tenantId = token.tenantId as string;
        session.user.plan = token.plan as Plan;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith('/') ? `${baseUrl}` : baseUrl;
    },
  },

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
    error: '/auth/error',
  },

  debug: process.env.NODE_ENV === 'development',
};