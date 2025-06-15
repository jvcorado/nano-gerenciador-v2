export interface Tenant {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: string;
  isActive: boolean;
  settings: {
    currency: string;
    timezone: string;
    language: string;
    branding: {
      primaryColor: string;
      logo?: string;
    };
  };
  limits: {
    maxClients: number;
    maxUsers: number;
  };
}

export interface TenantUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  isActive: boolean;
  createdAt: string;
}

export type TenantFormData = Omit<Tenant, 'id' | 'createdAt'>;