import "server-only";

import type { App } from "firebase-admin/app";

let adminAppPromise: Promise<App> | undefined;

function serverEnvironment(name: string): string | undefined {
  const value = process.env[name]?.trim();
  if (!value) return undefined;
  if (
    (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

async function initializeAdminApp(): Promise<App> {
  const { applicationDefault, cert, getApps, initializeApp } = await import("firebase-admin/app");
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId = serverEnvironment("FIREBASE_PROJECT_ID") || serverEnvironment("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  const clientEmail = serverEnvironment("FIREBASE_CLIENT_EMAIL");
  const privateKey = serverEnvironment("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n");

  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is not configured");
  }

  if (clientEmail && privateKey) {
    return initializeApp({
      projectId,
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({
      projectId,
      credential: applicationDefault(),
    });
  }

  throw new Error(
    "Firebase Admin is not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to the server environment."
  );
}

function getAdminApp(): Promise<App> {
  adminAppPromise ??= initializeAdminApp().catch((error) => {
    adminAppPromise = undefined;
    throw error;
  });
  return adminAppPromise;
}

export async function getAdminAuth() {
  const [{ getAuth }, app] = await Promise.all([
    import("firebase-admin/auth"),
    getAdminApp(),
  ]);
  return getAuth(app);
}

export async function getAdminDb() {
  const [{ getFirestore }, app] = await Promise.all([
    import("firebase-admin/firestore"),
    getAdminApp(),
  ]);
  return getFirestore(app);
}
