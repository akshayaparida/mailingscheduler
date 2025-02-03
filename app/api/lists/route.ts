import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const lists = await prisma.list.findMany({
      select: {
        id: true,
        name: true,
        emails: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: lists
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch lists' 
      },
      { status: 500 }
    );
  }
} 