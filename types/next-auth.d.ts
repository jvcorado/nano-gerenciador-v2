import NextAuth from "next-auth";
import { Plan, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: UserRole;
      tenantId?: string;
      plan?: Plan;
    };
  }

  interface User {
    id: string;
    role?: UserRole;
    tenantId?: string;
    plan?: Plan;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    tenantId?: string;
    plan?: Plan;
  }
}
