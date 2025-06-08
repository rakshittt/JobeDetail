import { prisma } from "./prisma";

export async function isUserSubscribed(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { subscription: true },
  });
  return user?.subscription?.status === "active";
}
