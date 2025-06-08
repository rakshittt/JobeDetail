import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const searches = await prisma.search.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    take: 10
  });
  return NextResponse.json({ searches });
}
