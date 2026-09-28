import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || "ahmed_hamada_super_secure_jwt_secret_key_2026_production";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function createSessionToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as string) || "admin",
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function verifyRequestSession(req: NextRequest): Promise<AdminSession | null> {
  const token =
    req.cookies.get("admin_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifySessionToken(token);
}
