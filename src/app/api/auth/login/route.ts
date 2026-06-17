import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Find user in DB
    const user = await (prisma as any).user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "No account found with this email. Please register first." }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json({ error: "This account has no password set." }, { status: 400 });
    }

    // Verify password using built-in crypto
    const isMatch = verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    // Return user info (role in lowercase for frontend AppContext)
    const roleMap: Record<string, string> = {
      STUDENT: "student",
      VOLUNTEER: "volunteer",
      ADMIN: "admin",
    };

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleMap[user.role] ?? "student",
      },
    });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
