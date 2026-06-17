import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/reports — Submit a resource error report, notify the uploader
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resourceId, description, reporterEmail } = body;

    if (!resourceId || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Find the resource and its uploader from DB
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: { submitter: true },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found." }, { status: 404 });
    }

    // Find reporter user if email provided
    let reporter = null;
    if (reporterEmail) {
      reporter = await prisma.user.findUnique({ where: { email: reporterEmail } });
    }

    // Create the report + notification for the uploader in a single transaction
    const report = await prisma.$transaction(async (tx) => {
      const newReport = await tx.report.create({
        data: {
          description,
          resourceId,
          reporterId: reporter?.id ?? null,
        },
      });

      // Create in-app notification for the resource uploader
      await tx.notification.create({
        data: {
          userId: resource.submitterId,
          type: "REPORT",
          message: `Someone reported an issue with your resource "${resource.title}": "${description.slice(0, 80)}${description.length > 80 ? "..." : ""}"`,
          reportId: newReport.id,
        },
      });

      return newReport;
    });

    return NextResponse.json({ success: true, reportId: report.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reports]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// GET /api/reports — Admin: get all open reports
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        resource: { select: { id: true, title: true } },
        reporter: { select: { name: true, email: true } },
      },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error("[GET /api/reports]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
