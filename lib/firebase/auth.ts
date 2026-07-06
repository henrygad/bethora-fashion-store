import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, sendPasswordResetEmail, onAuthStateChanged, User,
} from "firebase/auth";
import { doc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./config";
import type { UserProfile } from "@/types";

export async function signUp(name: string, email: string, phone: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const profile: UserProfile = {
    uid: cred.user.uid, name, email, phone, role: "customer", createdAt: Date.now(),
  };
  await setDoc(doc(db, "users", cred.user.uid), profile);
  return cred.user;
}

export async function logIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logOut() { return signOut(auth); }

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as UserProfile);
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const snap = await getDocs(q);
  if (snap.empty) throw new Error("User profile not found");
  return updateDoc(snap.docs[0].ref, data);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}