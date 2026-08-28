import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: true, workspaces: [] });
    }

    const workspaces = await prisma.workspace.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, workspaces });
  } catch (error) {
    console.error("Prisma workspace history error:", error);
    return NextResponse.json({ success: true, workspaces: [] });
  }
}
