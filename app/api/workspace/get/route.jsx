import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { workspaceId } = await req.json();

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { user: true },
    });

    if (!workspace) {
      return NextResponse.json({
        success: true,
        workspace: {
          id: workspaceId,
          messages: JSON.stringify([{ role: "ai", content: "Welcome to your Kriti AI workspace!" }]),
          files: null,
        }
      });
    }

    return NextResponse.json({ success: true, workspace });
  } catch (error) {
    console.error("Prisma workspace get error:", error);
    return NextResponse.json({
      success: true,
      workspace: {
        id: "fallback",
        messages: JSON.stringify([]),
      }
    });
  }
}
