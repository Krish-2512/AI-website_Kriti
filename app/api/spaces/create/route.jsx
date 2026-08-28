import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import uuid4 from "uuid4";

export async function POST(req) {
  try {
    const { name, description, icon, userId, userEmail, userName } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Space name is required" }, { status: 400 });
    }

    // Ensure owner user exists in database
    let ownerId = userId;
    if (!ownerId && userEmail) {
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
      ownerId = user.id;
    }

    if (!ownerId) {
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
      ownerId = defaultUser.id;
    }

    // Generate unique 6-character uppercase invite code (e.g. KRITI-8941)
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const inviteCode = `KRITI-${randomCode}`;

    const space = await prisma.space.create({
      data: {
        id: uuid4(),
        name,
        description: description || "Collaborative project space for team web applications.",
        icon: icon || "🚀",
        inviteCode,
        ownerId,
        members: {
          create: {
            id: uuid4(),
            userId: ownerId,
            role: "OWNER",
          },
        },
        activities: {
          create: {
            id: uuid4(),
            userName: userName || "Creator",
            action: "created_space",
            details: `Created the collaborative space "${name}".`,
          },
        },
      },
      include: {
        owner: true,
        members: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ success: true, space });
  } catch (error) {
    console.error("Error creating collaborative space:", error);
    return NextResponse.json({ error: error.message || "Failed to create space" }, { status: 500 });
  }
}
