import { PrismaClient, UserRole, Plan, ClientPlan, ClientStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {


  // Create demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { email: 'demo@empresa.com' },
    update: {},
    create: {
      name: 'Empresa Demo',
      email: 'demo@empresa.com',
      company: 'Empresa Demo Ltda',
      plan: Plan.PROFESSIONAL,
      maxClients: 200,
      maxUsers: 10,
      settings: {
        currency: 'BRL',
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        branding: {
          primaryColor: '#3b82f6',
        },
      },
    },
  });



  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@empresa.com' },
    update: {},
    create: {
      email: 'demo@empresa.com',
      name: 'Usuário Demo',
      role: UserRole.TENANT_ADMIN,
      tenantId: demoTenant.id,
    },
  });



  // Create sample clients
  const sampleClients = [
    {
      name: 'João Silva',
      email: 'joao@email.com',
      server: 'Server 1',
      plan: ClientPlan.MONTHLY,
      startDate: new Date('2024-01-15'),
      status: ClientStatus.ACTIVE,
    },
    {
      name: 'Maria Santos',
      email: 'maria@email.com',
      server: 'Server 2',
      plan: ClientPlan.ANNUAL,
      startDate: new Date('2023-12-01'),
      status: ClientStatus.ACTIVE,
    },
    {
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      server: 'Server 1',
      plan: ClientPlan.MONTHLY,
      startDate: new Date('2024-01-01'),
      status: ClientStatus.ACTIVE,
    },
    {
      name: 'Ana Oliveira',
      email: 'ana@email.com',
      server: 'Server 3',
      plan: ClientPlan.ANNUAL,
      startDate: new Date('2023-11-15'),
      status: ClientStatus.ACTIVE,
    },
    {
      name: 'Carlos Ferreira',
      email: 'carlos@email.com',
      server: 'Server 2',
      plan: ClientPlan.MONTHLY,
      startDate: new Date('2024-02-01'),
      status: ClientStatus.INACTIVE,
    },
  ];

  for (const clientData of sampleClients) {
    // Calculate expiration date
    const expiration = new Date(clientData.startDate);
    if (clientData.plan === ClientPlan.MONTHLY) {
      expiration.setMonth(expiration.getMonth() + 1);
    } else {
      expiration.setFullYear(expiration.getFullYear() + 1);
    }

    await prisma.client.create({
      data: {
        ...clientData,
        expirationDate: expiration,
        tenantId: demoTenant.id,
        createdBy: demoUser.id,
      },
    });
  }


}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });