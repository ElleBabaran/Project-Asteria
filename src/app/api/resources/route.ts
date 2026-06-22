import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Get form fields
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string; // 'PDF', 'PPT', etc.
    const country = formData.get("country") as string;
    const curriculum = formData.get("curriculum") as string;
    const grade = formData.get("grade") as string;
    const subject = formData.get("subject") as string;
    const submitterEmail = formData.get("submitterEmail") as string;
    const submitterRole = formData.get("submitterRole") as string || "volunteer";

    if (!file || !title || !country || !curriculum || !grade || !subject || !submitterEmail) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // --- 1. Handle File Upload (Save to /public/uploads) ---
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    const fileUrl = `/uploads/${filename}`;

    // --- 2. Find or Create Submitter User ---
    let user = await prisma.user.findUnique({ where: { email: submitterEmail } });
    const dbRole = submitterRole.toUpperCase() === "ADMIN" ? "ADMIN" :
                   submitterRole.toUpperCase() === "STUDENT" ? "STUDENT" : "VOLUNTEER";

    if (!user) {
      // Create a fallback user if they logged in via mocked AppContext but don't exist in DB
      user = await prisma.user.create({
        data: {
          email: submitterEmail,
          name: submitterEmail.split("@")[0],
          role: dbRole
        }
      });
    } else if (user.role !== dbRole) {
      // Update role if mismatch (e.g. sandbox login)
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: dbRole }
      });
    }

    // --- 3. Find or Create Taxonomy (Country -> Curriculum -> Grade -> Subject) ---
    // A. Country
    let c = await prisma.country.findUnique({ where: { name: country } });
    if (!c) {
      c = await prisma.country.create({ data: { name: country, code: country.substring(0, 3).toUpperCase() + Math.floor(Math.random()*100) } });
    }
    // B. Curriculum
    let curr = await prisma.curriculum.findFirst({ where: { name: curriculum, countryId: c.id } });
    if (!curr) {
      curr = await prisma.curriculum.create({ data: { name: curriculum, countryId: c.id } });
    }
    // C. Grade
    let g = await prisma.grade.findFirst({ where: { name: grade, curriculumId: curr.id } });
    if (!g) {
      g = await prisma.grade.create({ data: { name: grade, curriculumId: curr.id } });
    }
    // D. Subject
    let s = await prisma.subject.findFirst({ where: { name: subject, gradeId: g.id } });
    if (!s) {
      s = await prisma.subject.create({ data: { name: subject, gradeId: g.id } });
    }

    // Map file type to Enum
    let resourceType: any = "OTHER";
    if (type === "PDF" || type === "DOC") resourceType = "STUDY_GUIDE";
    else if (type === "Worksheet") resourceType = "WORKSHEET";

    // --- 4. Create the Resource ---
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        fileUrl,
        type: resourceType,
        status: user.role === "ADMIN" ? "APPROVED" : "PENDING",
        submitterId: user.id,
        subjectId: s.id,
      }
    });

    return NextResponse.json({ success: true, resource, fileUrl });
  } catch (error) {
    console.error("[POST /api/resources]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
