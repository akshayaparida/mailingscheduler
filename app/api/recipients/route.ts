import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lists = await prisma.recipientGroup.findMany(); // Fetch all recipient lists
    return NextResponse.json(lists);
  } catch (error) {
    console.error("Error fetching recipient lists:", error); // Log the error
    return NextResponse.json({ error: "Failed to fetch recipient lists" }, { status: 500 });
  }
}
