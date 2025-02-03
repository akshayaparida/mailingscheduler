import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      select: {
        id: true,
        name: true,
        subject: true,
        body: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch templates' 
      },
      { status: 500 }
    );
  }
}
