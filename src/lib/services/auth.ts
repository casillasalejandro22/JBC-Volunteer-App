// TODO: Replace with Firebase Authentication
// This mock service simulates Firebase Auth operations.
// When integrating Firebase, replace these functions with:
//   - firebase.auth().signInWithEmailAndPassword()
//   - firebase.auth().createUserWithEmailAndPassword()
//   - firebase.auth().onAuthStateChanged()
//   - firebase.auth().signOut()

import { User, UserRole } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function loginUser(
  email: string,
  _password: string
): Promise<User | null> {
  await delay(500);
  return mockUsers.find((u) => u.email === email) ?? null;
}

export async function loginByRole(role: UserRole): Promise<User> {
  await delay(300);
  const user = mockUsers.find((u) => u.role === role);
  if (!user) throw new Error(`No mock user with role ${role}`);
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  await delay(200);
  return mockUsers.find((u) => u.id === id) ?? null;
}

export async function logoutUser(): Promise<void> {
  await delay(200);
}
