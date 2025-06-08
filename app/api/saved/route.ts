import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { company } = await req.json();
  if (!company) {
    return NextResponse.json({ error: "Missing company" }, { status: 400 });
  }
  // Check if already saved
  const existing = await prisma.savedCompany.findFirst({
    where: {
      user: { email: session.user.email },
      company,
    },
  });
  if (existing) {
    return NextResponse.json({ message: "Already saved" }, { status: 200 });
  }
  // Save company
  await prisma.savedCompany.create({
    data: {
      user: { connect: { email: session.user.email } },
      company,
    },
  });
  return NextResponse.json({ message: "Saved" });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { company } = await req.json();
  if (!company) {
    return NextResponse.json({ error: "Missing company" }, { status: 400 });
  }
  await prisma.savedCompany.deleteMany({
    where: {
      user: { email: session.user.email },
      company,
    },
  });
  return NextResponse.json({ message: "Unsaved" });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const saved = await prisma.savedCompany.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ saved });
}
