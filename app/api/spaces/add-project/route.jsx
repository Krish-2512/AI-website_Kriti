import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import uuid4 from "uuid4";

export async function POST(req) {
  try {
    const { spaceId, workspaceId, title, userName } = await req.json();

    if (!spaceId || !workspaceId) {
      return NextResponse.json({ error: "spaceId and workspaceId are required" }, { status: 400 });
    }

    const space = await prisma.space.findUnique({ where: { id: spaceId } });
    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    // Link workspace to space
    const updated = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        spaceId: spaceId,
        isShared: true,
        title: title || "Kriti Shared Project",
      },
    });

    // Record activity
    await prisma.spaceActivity.create({
      data: {
        id: uuid4(),
        spaceId: spaceId,
        userName: userName || "Collaborator",
        action: "added_project",
        details: `Published project "${title || "Kriti Web App"}" to the space.`,
      },
    });

    return NextResponse.json({ success: true, workspace: updated });
  } catch (error) {
    console.error("Error adding project to space:", error);
    return NextResponse.json({ error: error.message || "Failed to link project" }, { status: 500 });
  }
}
