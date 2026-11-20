import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export async function requireUser(request: Request): Promise<DecodedIdToken> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentication required");
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) throw new HttpError(401, "Authentication required");

  try {
    const auth = await getAdminAuth();
    return await auth.verifyIdToken(token, true);
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";
    if (!code.startsWith("auth/")) throw error;
    throw new HttpError(401, "Invalid or expired session");
  }
}

export async function requireAdmin(request: Request): Promise<DecodedIdToken> {
  const user = await requireUser(request);
  const db = await getAdminDb();
  const profile = await db.collection("users").doc(user.uid).get();
  if (!profile.exists || profile.data()?.role !== "admin") {
    throw new HttpError(403, "Admin access required");
  }
  return user;
}

export function errorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return Response.json({ error: "Unexpected server error" }, { status: 500 });
}

