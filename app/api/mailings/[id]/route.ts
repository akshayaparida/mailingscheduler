import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Prisma client setup

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid mailing ID' }, { status: 400 });
    }

    const deletedMailing = await prisma.mailing.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(deletedMailing);
  } catch (error) {
    console.error("Error deleting mailing:", error);
    return NextResponse.json({ error: 'Failed to delete mailing' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Invalid mailing ID' }, { status: 400 });
    }

    const data = await req.json();
    const updatedMailing = await prisma.mailing.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(updatedMailing);
  } catch (error) {
    console.error("Error updating mailing:", error);
    return NextResponse.json({ error: 'Failed to update mailing' }, { status: 500 });
  }
}
