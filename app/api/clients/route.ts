import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ClientPlan, ClientStatus } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('[SESSION DEBUG]', session);

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      where: {
        tenantId: session.user.tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const serializedClients = clients.map(client => ({
      ...client,
      startDate: client.startDate.toISOString().split('T')[0],
      expirationDate: client.expirationDate.toISOString().split('T')[0],
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedClients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId || !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 🔒 Verifica plano e limite de clientes
    const tenant = await prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
      include: {
        _count: {
          select: { clients: true },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 });
    }

    const limite =
      tenant.plan === 'STARTER' ? 20 : tenant.maxClients ?? 1000;

    if (tenant._count.clients >= limite) {
      return NextResponse.json(
        {
          error: `Limite de clientes atingido para o plano ${tenant.plan}.`,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, server, plan, startDate, status } = body;

    const start = new Date(startDate);
    const expiration = new Date(start);

    if (plan === ClientPlan.MONTHLY) {
      expiration.setMonth(start.getMonth() + 1);
    } else {
      expiration.setFullYear(start.getFullYear() + 1);
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        server,
        plan,
        startDate: start,
        expirationDate: expiration,
        status,
        tenantId: session.user.tenantId,
        createdBy: session.user.id,
      },
    });

    const serializedClient = {
      ...client,
      startDate: client.startDate.toISOString().split('T')[0],
      expirationDate: client.expirationDate.toISOString().split('T')[0],
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedClient);
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}