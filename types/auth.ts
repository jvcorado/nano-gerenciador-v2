export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'tenant_admin' | 'tenant_user';
  tenantId?: string; // null for super_admin
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  company: string;
  plan: 'starter' | 'professional' | 'enterprise';
}