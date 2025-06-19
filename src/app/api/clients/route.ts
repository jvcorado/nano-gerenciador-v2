export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { ClientPlan } from '@prisma/client';

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clients = await prisma!.client.findMany({
      where: { tenantId: token.tenantId },
      orderBy: { createdAt: 'desc' },
    });

    const serializedClients = clients.map((client) => ({
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
  const token = await getToken({ req: request });

  if (!token?.tenantId || !token?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, server, plan, startDate, status } = body;

    if (!name || !email || !server || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tenant = await prisma!.tenant.findUnique({
      where: { id: token.tenantId },
      include: { _count: { select: { clients: true } } },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const clientLimit = tenant.plan === 'STARTER' ? 20 : tenant.maxClients ?? 1000;
    if (tenant._count.clients >= clientLimit) {
      return NextResponse.json(
        { error: `Limite de clientes atingido para o plano ${tenant.plan}.` },
        { status: 403 }
      );
    }

    const start = new Date(startDate);
    const expiration = new Date(start);

    if (plan === ClientPlan.MONTHLY) {
      expiration.setMonth(start.getMonth() + 1);
    } else {
      expiration.setFullYear(start.getFullYear() + 1);
    }

    const existingClient = await prisma!.client.findFirst({
      where: {
        email,
        tenantId: token.tenantId,
      },
    });

    if (existingClient) {
      return NextResponse.json({ error: 'Client with this email already exists' }, { status: 409 });
    }

    const client = await prisma!.client.create({
      data: {
        name,
        email,
        server,
        plan,
        startDate: start,
        expirationDate: expiration,
        status,
        tenantId: token.tenantId,
        createdBy: token.id,
      },
    });

    const serializedClient = {
      ...client,
      startDate: client.startDate.toISOString().split('T')[0],
      expirationDate: client.expirationDate.toISOString().split('T')[0],
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedClient, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
