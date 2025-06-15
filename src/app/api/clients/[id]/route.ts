// src/app/api/clients/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma, isPrismaAvailable } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o Prisma está disponível
    if (!isPrismaAvailable()) {
      return NextResponse.json(
        { error: 'Database não disponível' },
        { status: 503 }
      );
    }

    // Usar getPrisma() que garante que não é null
    const prisma = getPrisma();

    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        // suas relações aqui
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isPrismaAvailable()) {
      return NextResponse.json(
        { error: 'Database não disponível' },
        { status: 503 }
      );
    }

    const prisma = getPrisma();
    const body = await request.json();

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isPrismaAvailable()) {
      return NextResponse.json(
        { error: 'Database não disponível' },
        { status: 503 }
      );
    }

    const prisma = getPrisma();

    await prisma.client.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}