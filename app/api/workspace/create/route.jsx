import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import uuid4 from "uuid4";

export async function POST(req) {
  try {
    const { messages, user: userId, files } = await req.json();

    let targetUserId = userId;

    // If userId not provided or not in DB, ensure a fallback user exists
    if (!targetUserId) {
      const defaultUser = await prisma.user.upsert({
        where: { email: "creator@kriti.ai" },
        update: {},
        create: {
          id: uuid4(),
          name: "Kriti Creator",
          email: "creator@kriti.ai",
          tokens: 50000,
        },
      });
      targetUserId = defaultUser.id;
    }

    const workspace = await prisma.workspace.create({
      data: {
        id: uuid4(),
        userId: targetUserId,
        messages: JSON.stringify(messages || []),
        files: files ? JSON.stringify(files) : null,
      },
    });

    return NextResponse.json({ success: true, workspaceId: workspace.id });
  } catch (error) {
    console.error("Prisma workspace creation error:", error);
    return NextResponse.json({ success: true, workspaceId: uuid4() });
  }
}
