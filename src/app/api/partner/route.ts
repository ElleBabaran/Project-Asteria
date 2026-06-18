import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgName, contactName, email, type, details } = body;

    if (!orgName || !contactName || !email || !details) {
      return NextResponse.json({ error: "Organization, contact name, email, and details are required." }, { status: 400 });
    }

    // In a real app, this would enqueue a partner request,
    // create a CRM lead, or send a notification to the partnership team.
    console.log("Received partner request:", { orgName, contactName, email, type, details });

    return NextResponse.json({ success: true, message: "Partnership request received." }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/partner]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
