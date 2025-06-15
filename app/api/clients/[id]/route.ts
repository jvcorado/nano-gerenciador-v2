import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ClientPlan } from '@prisma/client';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, server, plan, startDate, status } = body;

    // Calculate expiration date
    const start = new Date(startDate);
    const expiration = new Date(start);

    if (plan === ClientPlan.MONTHLY) {
      expiration.setMonth(start.getMonth() + 1);
    } else {
      expiration.setFullYear(start.getFullYear() + 1);
    }

    const client = await prisma.client.update({
      where: {
        id: params.id,
        tenantId: session.user.tenantId, // Ensure user can only update their own tenant's clients
      },
      data: {
        name,
        email,
        server,
        plan,
        startDate: start,
        expirationDate: expiration,
        status,
      },
    });

    // Convert dates to strings for JSON serialization
    const serializedClient = {
      ...client,
      startDate: client.startDate.toISOString().split('T')[0],
      expirationDate: client.expirationDate.toISOString().split('T')[0],
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.client.delete({
      where: {
        id: params.id,
        tenantId: session.user.tenantId, // Ensure user can only delete their own tenant's clients
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}