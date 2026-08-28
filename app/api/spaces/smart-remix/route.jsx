import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import uuid4 from "uuid4";
import { generateHarmonicPalette } from "@/lib/kmeansClustering";

export async function POST(req) {
  try {
    const { sourceWorkspaceId, targetUserId, targetUserName, customTheme = "indigo" } = await req.json();

    if (!sourceWorkspaceId) {
      return NextResponse.json({ error: "sourceWorkspaceId is required" }, { status: 400 });
    }

    const sourceWorkspace = await prisma.workspace.findUnique({
      where: { id: sourceWorkspaceId },
      include: { user: true },
    });

    if (!sourceWorkspace) {
      return NextResponse.json({ error: "Source workspace not found" }, { status: 404 });
    }

    // Generate harmonized color palette for the remix
    const palette = generateHarmonicPalette(customTheme);

    // Create a new forked workspace for the remixing user
    const newWorkspace = await prisma.workspace.create({
      data: {
        id: uuid4(),
        userId: targetUserId || sourceWorkspace.userId,
        title: `Remix: ${sourceWorkspace.title || "Kriti App"}`,
        messages: sourceWorkspace.messages,
        files: sourceWorkspace.files,
        isShared: false,
      },
    });

    // Record activity in source space if exists
    if (sourceWorkspace.spaceId) {
      await prisma.spaceActivity.create({
        data: {
          id: uuid4(),
          spaceId: sourceWorkspace.spaceId,
          userName: targetUserName || "A Collaborator",
          action: "remixed_project",
          details: `Remixed project "${sourceWorkspace.title || "Kriti App"}" with AI style harmonization.`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      workspaceId: newWorkspace.id,
      palette,
      message: "Project successfully remixed and harmonized!",
    });
  } catch (error) {
    console.error("Error in space smart-remix API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
