import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { spaceId } = await req.json();

    if (!spaceId) {
      return NextResponse.json({ error: "spaceId is required" }, { status: 400 });
    }

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        owner: true,
        members: {
          include: { user: true },
          orderBy: { joinedAt: "asc" },
        },
        workspaces: {
          include: { user: true },
          orderBy: { updatedAt: "desc" },
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, space });
  } catch (error) {
    console.error("Error fetching space details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
