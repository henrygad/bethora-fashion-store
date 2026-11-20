import { cert, deleteApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured in .env.local`);
  return value;
}

function readEmail() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("Provide the Firebase Authentication user's email address");
  }
  return email;
}

async function grantAdmin() {
  const email = readEmail();
  const projectId = requiredEnvironment("FIREBASE_PROJECT_ID");
  const clientEmail = requiredEnvironment("FIREBASE_CLIENT_EMAIL");
  const privateKey = requiredEnvironment("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const app = getApps()[0] ?? initializeApp({
    projectId,
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  try {
    const user = await getAuth(app).getUserByEmail(email);
    const profileRef = getFirestore(app).collection("users").doc(user.uid);
    const existingProfile = await profileRef.get();
    const existingData = existingProfile.data();

    await profileRef.set({
      uid: user.uid,
      name: existingData?.name || user.displayName || email.split("@")[0],
      email: user.email || email,
      phone: existingData?.phone || user.phoneNumber || "",
      role: "admin",
      createdAt: existingData?.createdAt || Date.parse(user.metadata.creationTime),
      updatedAt: Date.now(),
    }, { merge: true });

    console.log(`Admin access granted to ${email} (${user.uid}).`);
    console.log("The user can now sign in at /login and open /admin.");
  } finally {
    await deleteApp(app);
  }
}

grantAdmin().catch((error) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Could not grant admin access: ${message}`);
  process.exitCode = 1;
});
