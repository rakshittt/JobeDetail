import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export async function isSubscribed(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  return user?.subscription?.status === "ACTIVE";
}
