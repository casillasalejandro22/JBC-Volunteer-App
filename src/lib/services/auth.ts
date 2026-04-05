import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, UserRole } from "@/lib/types";

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const user = await getUserById(credential.user.uid);
  if (!user) throw new Error("User profile not found");
  return user;
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const newUser: User = {
    id: credential.user.uid,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, "users", credential.user.uid), newUser);
  return newUser;
}

export async function getUserById(id: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as User;
}

export async function updateUserRole(
  id: string,
  role: UserRole
): Promise<void> {
  await setDoc(doc(db, "users", id), { role }, { merge: true });
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
