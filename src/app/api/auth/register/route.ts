import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, adminRole } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        error: "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character."
      }, { status: 400 });
    }

    // Check if user already exists
    const existing = await (prisma as any).user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    // Hash password using built-in crypto
    const hashedPassword = hashPassword(password);

    // Map role string to DB enum
    const roleMap: Record<string, "STUDENT" | "VOLUNTEER" | "ADMIN"> = {
      student: "STUDENT",
      volunteer: "VOLUNTEER",
      admin: "ADMIN",
    };

    // Create user
    const userData: { name: string; email: string; password: string; role: "STUDENT" | "VOLUNTEER" | "ADMIN"; adminRole?: string | null } = {
      name,
      email,
      password: hashedPassword,
      role: roleMap[role] ?? "STUDENT",
    };

    if (role === "admin") {
      userData.adminRole = adminRole ?? null;
    }

    const user = await (prisma as any).user.create({
      data: userData,
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, adminRole: user.adminRole },
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    const message =
      process.env.NODE_ENV !== "production"
        ? error instanceof Error
          ? error.message
          : String(error)
        : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}