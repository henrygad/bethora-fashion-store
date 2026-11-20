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
    return await getAdminAuth().verifyIdToken(token, true);
  } catch {
    throw new HttpError(401, "Invalid or expired session");
  }
}

export async function requireAdmin(request: Request): Promise<DecodedIdToken> {
  const user = await requireUser(request);
  const profile = await getAdminDb().collection("users").doc(user.uid).get();
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

