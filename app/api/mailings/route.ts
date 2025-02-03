import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { mailQueue } from "@/lib/queue";

import { PrismaClient } from "@prisma/client";

// Create a new Prisma instance with logging

const prismaWithLogging = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Received POST request body:", body);

    const { templateId, listId, scheduleTime, subject, body: mailBody } = body;

    console.log("Parsed values:", {
      templateId,
      listId,
      scheduleTime,
      subject,
      mailBody,
    });

    // Enhanced validation with detailed errors

    const errors = [];

    if (!templateId) errors.push("Template ID is required");

    if (!listId) errors.push("List ID is required");

    if (!scheduleTime) errors.push("Schedule time is required");

    if (!subject) errors.push("Subject is required");

    if (!mailBody) errors.push("Body is required");

    if (errors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: errors },

        { status: 400 }
      );
    }

    // Validate IDs

    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },

      select: {
        id: true,

        name: true,

        subject: true,

        body: true,
      },
    });

    const list = await prisma.list.findUnique({
      where: { id: listId },

      select: {
        id: true,

        emails: true,
      },
    });

    if (!template || !list) {
      return NextResponse.json(
        {
          error: "Invalid template or list ID",

          details: {
            template: !!template,

            list: !!list,

            templateId,

            listId,
          },
        },

        { status: 400 }
      );
    }

    const scheduleDate = new Date(scheduleTime);

    if (isNaN(scheduleDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid schedule date format",

          details: { receivedTime: scheduleTime },
        },
        { status: 400 }
      );
    }

    // Validate future date

    if (scheduleDate <= new Date()) {
      return NextResponse.json(
        {
          error: "Scheduled time must be in the future",

          details: { scheduledTime: scheduleDate, currentTime: new Date() },
        },
        { status: 400 }
      );
    }

    // Create mailing with all fields

    const newMailing = await prisma.mailing.create({
      data: {
        templateId,

        listId,

        schedule: scheduleDate,

        subject,

        body: mailBody,

        mailerId: 1,
      },

      include: {
        list: true,

        template: true,
      },
    });

    // Add to queue with delay

    const delay = new Date(scheduleTime).getTime() - Date.now();

    await mailQueue.add(
      "sendEmail",

      {
        mailingId: newMailing.id,

        mailerId: newMailing.mailerId,

        listId: newMailing.listId,

        schedule: scheduleTime,
      },

      {
        delay: Math.max(0, delay),

        removeOnComplete: true,

        removeOnFail: true,
      }
    );

    console.log("Created new mailing:", newMailing);

    return NextResponse.json(newMailing, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/mailings:", error);

    return NextResponse.json(
      {
        error: "Error creating mailing",

        details: error instanceof Error ? error.message : "Unknown error",
      },

      { status: 500 }
    );
  }
}

// Add PUT endpoint for editing mailings

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Mailing ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { templateId, listId, scheduleTime } = body;

    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Update mailing

    const updatedMailing = await prisma.mailing.update({
      where: { id: parseInt(id) },

      data: {
        templateId,

        listId,

        schedule: new Date(scheduleTime),

        subject: template.subject,

        body: template.body,

        updatedAt: new Date(),

        status: "pending", // Reset status to pending
      },
    });

    return NextResponse.json(updatedMailing);
  } catch (error) {
    console.error("Error updating mailing:", error);

    return NextResponse.json(
      { error: "Failed to update mailing" },

      { status: 500 }
    );
  }
}

// Updated DELETE endpoint with proper type handling

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const idStr = searchParams.get("id");

    if (!idStr) {
      return NextResponse.json(
        { error: "Mailing ID is required" },
        { status: 400 }
      );
    }

    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid mailing ID format" },
        { status: 400 }
      );
    }

    const existingMailing = await prisma.mailing.findUnique({ where: { id } });

    if (!existingMailing) {
      return NextResponse.json({ error: "Mailing not found" }, { status: 404 });
    }

    await prisma.mailing.delete({ where: { id } });

    return NextResponse.json({ message: "Mailing deleted successfully" });
  } catch (error: unknown) {
    console.error("Error deleting mailing:", error);

    return NextResponse.json(
      {
        error: "Error deleting mailing",
        details: error instanceof Error ? error.message : "Unknown error",
      },

      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("Starting GET request for mailings...");

    const mailings = await prisma.mailing.findMany({
      include: {
        list: true,

        template: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Fetched mailings:", mailings);

    return NextResponse.json({
      success: true,

      count: mailings.length,

      data: mailings.map((mailing) => ({
        ...mailing,

        status: mailing.status || "pending",
      })),
    });
  } catch (error) {
    console.error("Error fetching mailings:", error);

    return NextResponse.json(
      {
        success: false,

        error: "Failed to fetch mailings",

        details: error instanceof Error ? error.message : "Unknown error",
      },

      { status: 500 }
    );
  }
}
