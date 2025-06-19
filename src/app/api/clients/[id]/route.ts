// src/app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { ClientPlan } from '@prisma/client';

// GET - Buscar cliente por ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req });
  if (!token?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await prisma!.client.findFirst({
      where: {
        id: params.id,
        tenantId: token.tenantId,
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const serializedClient = {
      ...client,
      startDate: client.startDate.toISOString().split('T')[0],
      expirationDate: client.expirationDate.toISOString().split('T')[0],
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedClient);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Atualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req: request });
  if (!token?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = params.id;
    const body = await request.json();
    const { name, email, server, plan, startDate, status } = body;

    if (!name || !email || !server || !startDate || !plan || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const clientExists = await prisma!.client.findFirst({
      where: {
        id: clientId,
        tenantId: token.tenantId,
      },
    });

    if (!clientExists) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const start = new Date(startDate);
    const expiration = new Date(start);

    if (plan === ClientPlan.MONTHLY) {
      expiration.setMonth(start.getMonth() + 1);
    } else {
      expiration.setFullYear(start.getFullYear() + 1);
    }

    const updatedClient = await prisma!.client.update({
      where: { id: clientId },
      data: {
        name,
        email,
        server,
        plan,
        status,
        startDate: start,
        expirationDate: expiration,
        updatedAt: new Date(),
      },
    });

    const serializedClient = {
      ...updatedClient,
      startDate: updatedClient.startDate.toISOString().split('T')[0],
      expirationDate: updatedClient.expirationDate.toISOString().split('T')[0],
      createdAt: updatedClient.createdAt.toISOString(),
      updatedAt: updatedClient.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remover cliente
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req });
  if (!token?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deleted = await prisma!.client.deleteMany({
      where: {
        id: params.id,
        tenantId: token.tenantId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
