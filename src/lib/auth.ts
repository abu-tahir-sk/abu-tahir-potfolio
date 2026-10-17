import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/db";

export const AUTH_COOKIE_NAME = "portfolio_admin_session";
const JWT_SECRET = process.env.AUTH_SECRET || "fallback-secret-for-dev-environment-change-in-prod-32bytes";
const key = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  id: string;
  email: string;
  name?: string | null;
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.id) return null;

    // Verify user still exists in database
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized: Admin authentication required");
  }
  return session;
}
