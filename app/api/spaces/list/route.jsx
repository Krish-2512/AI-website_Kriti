import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId, userEmail } = await req.json();

    let targetUserId = userId;
    if (!targetUserId && userEmail) {
      const user = await prisma.user.findUnique({ where: { email: userEmail } });
      if (user) targetUserId = user.id;
    }

    if (!targetUserId) {
      // Return all spaces as public demo if no user specified
      const allSpaces = await prisma.space.findMany({
        include: {
          owner: true,
          members: { include: { user: true } },
          workspaces: { include: { user: true } },
        },
        orderBy: { updatedAt: "desc" },
      });
      return NextResponse.json({ success: true, spaces: allSpaces });
    }

    // Find all spaces user owns OR is a member of
    const spaces = await prisma.space.findMany({
      where: {
        OR: [
          { ownerId: targetUserId },
          { members: { some: { userId: targetUserId } } },
        ],
      },
      include: {
        owner: true,
        members: { include: { user: true } },
        workspaces: { include: { user: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, spaces });
  } catch (error) {
    console.error("Error listing spaces:", error);
    return NextResponse.json({ success: true, spaces: [] });
  }
}
