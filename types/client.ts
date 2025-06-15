export interface Client {
  id: string;
  tenantId: string; // Added tenant isolation
  name: string;
  email: string;
  server: string;
  plan: 'monthly' | 'annual';
  startDate: string;
  expirationDate: string;
  status: 'active' | 'inactive';
  createdBy: string; // User who created the client
  createdAt: string;
  updatedAt: string;
}

export type ClientFormData = Omit<Client, 'id' | 'expirationDate' | 'tenantId' | 'createdBy' | 'createdAt' | 'updatedAt'>;