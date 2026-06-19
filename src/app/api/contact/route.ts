import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, topic, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    // In a real app, this is where we'd enqueue a support ticket,
    // send an email, or persist the contact request.
    console.log("Received contact request:", { name, email, topic, message });

    return NextResponse.json({ success: true, message: "Contact request received." }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
