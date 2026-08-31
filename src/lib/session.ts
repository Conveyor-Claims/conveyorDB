import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "conveyordb_session";
const ADMIN_VALUE = "admin";
const PARALEGAL_VALUE = "paralegal";

export type StaffRole = "admin" | "paralegal";

export type Session = {
  role: StaffRole;
};

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  if (value === ADMIN_VALUE) return { role: "admin" };
  if (value === PARALEGAL_VALUE) return { role: "paralegal" };
  return null;
}

export function isSignedIn(session: Session | null): boolean {
  return session !== null;
}

export function isAdmin(session: Session | null): boolean {
  return session?.role === "admin";
}

export function isParalegal(session: Session | null): boolean {
  return session?.role === "paralegal";
}

async function setSessionCookie(value: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function signInTemporaryAdmin() {
  "use server";
  await setSessionCookie(ADMIN_VALUE);
  redirect("/cases");
}

export async function signInTemporaryParalegal() {
  "use server";
  await setSessionCookie(PARALEGAL_VALUE);
  redirect("/cases");
}

export async function signOut() {
  "use server";
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}
