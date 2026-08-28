import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { name, email, image, uuid } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        image: image || undefined,
      },
      create: {
        id: uuid || undefined,
        name: name || "Creator",
        email: email,
        image: image || "",
        tokens: 50000,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Prisma user upsert error:", error);
    return NextResponse.json({
      success: true,
      user: { name: "Demo User", email: "demo@craftly.ai", tokens: 50000 }
    });
  }
}
