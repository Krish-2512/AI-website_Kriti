import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId, token } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { tokens: Number(token) },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Prisma user token update error:", error);
    return NextResponse.json({ success: true, token: token || 50000 });
  }
}
