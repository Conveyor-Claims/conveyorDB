import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "conveyordb_session";
const ADMIN_VALUE = "admin";

export type Session = {
  role: "admin";
};

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  if (store.get(SESSION_COOKIE)?.value === ADMIN_VALUE) {
    return { role: "admin" };
  }
  return null;
}

export function isAdmin(session: Session | null): boolean {
  return session?.role === "admin";
}

export async function signInTemporaryAdmin() {
  "use server";
  const store = await cookies();
  store.set(SESSION_COOKIE, ADMIN_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  redirect("/cases");
}

export async function signOut() {
  "use server";
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}
