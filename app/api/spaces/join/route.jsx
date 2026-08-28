import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import uuid4 from "uuid4";

export async function POST(req) {
  try {
    const { inviteCode, userId, userEmail, userName } = await req.json();

    if (!inviteCode) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    const cleanCode = inviteCode.trim().toUpperCase();

    const space = await prisma.space.findUnique({
      where: { inviteCode: cleanCode },
    });

    if (!space) {
      return NextResponse.json({ error: "Invalid invite code. Please verify and try again." }, { status: 404 });
    }

    // Ensure member user exists
    let targetUserId = userId;
    if (!targetUserId && userEmail) {
      const user = await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: {
          id: uuid4(),
          name: userName || "Creator",
          email: userEmail,
          tokens: 50000,
        },
      });
      targetUserId = user.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "User authentication required to join space" }, { status: 401 });
    }

    // Add user as member (upsert to prevent duplicate crashes)
    await prisma.spaceMember.upsert({
      where: {
        spaceId_userId: {
          spaceId: space.id,
          userId: targetUserId,
        },
      },
      update: {},
      create: {
        id: uuid4(),
        spaceId: space.id,
        userId: targetUserId,
        role: "MEMBER",
      },
    });

    // Record activity
    await prisma.spaceActivity.create({
      data: {
        id: uuid4(),
        spaceId: space.id,
        userName: userName || "New Collaborator",
        action: "joined_space",
        details: `Joined "${space.name}" via invite code.`,
      },
    });

    return NextResponse.json({ success: true, spaceId: space.id, spaceName: space.name });
  } catch (error) {
    console.error("Error joining space:", error);
    return NextResponse.json({ error: error.message || "Failed to join space" }, { status: 500 });
  }
}
