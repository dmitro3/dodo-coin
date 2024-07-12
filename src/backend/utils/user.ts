import prisma from "@backend/modules/prisma/Prisma";
import {User} from "@prisma/client";
import {NextRequest} from "next/server";
import {ssrOptimize} from "@/utils/other";


export function getToken(request: NextRequest) {
  const headers = Object.fromEntries(request.headers);
  return (
    headers?.authorization?.split?.(" ")?.pop?.() ||
    headers?.token ||
    headers?.login ||
    request.cookies.get("token")?.value ||
    request.cookies.get("admin_token")?.value
  );
}

export async function getUser(token?: string | NextRequest | undefined) {
  if (token && typeof token !== "string") {
    token = getToken(token);
  }
	console.log("TOKEN", token);
  if (!token) {
    return null;
  }
  const user = (await prisma.user.findUnique({ where: { token: token+"" } }));
  if (!user) return null;
  return ssrOptimize({
    ...user,
    token: "****",
    password: "****"
  }) as unknown as Awaited<ReturnType<typeof prisma.user.findFirst>>;
}


export function getClientIp() {
	
}
