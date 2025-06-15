import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { prisma, isPrismaAvailable } from '@/lib/prisma';
import { Plan, UserRole } from '@prisma/client';

// Função para criar o adapter de forma segura
function createAdapter() {
  if (isPrismaAvailable() && prisma) {
    return PrismaAdapter(prisma);
  }
  return undefined;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Se o Prisma não estiver disponível, apenas permite o login
      if (!isPrismaAvailable() || !prisma) {
        console.log('Prisma not available, allowing sign in');
        return true;
      }

      if (!user.email) {
        console.log('No user email provided');
        return false;
      }

      try {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { tenant: true },
        });

        // Se o usuário já existe, verifica/cria a conta
        if (dbUser && account) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

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

        // Se o usuário não existe, cria novo tenant e usuário
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

        // Verifica se o tenant está ativo
        if (!dbUser.tenantId || !dbUser.tenant) {
          console.log('User has no tenant or tenant is inactive');
          return false;
        }

        return dbUser.tenant.isActive;
      } catch (error) {
        console.error('Erro no signIn callback:', error);
        // Em caso de erro, permite o login para não bloquear o usuário
        return true;
      }
    },

    async jwt({ token, user }) {
      if (!isPrismaAvailable() || !prisma) {
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
      // Garante que URLs relativas sejam tratadas corretamente
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Se a URL já inclui o baseUrl, retorna como está
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Por padrão, redireciona para a home
      return baseUrl;
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

// Adiciona o adapter apenas se o Prisma estiver disponível
const adapter = createAdapter();
if (adapter) {
  authOptions.adapter = adapter;
}