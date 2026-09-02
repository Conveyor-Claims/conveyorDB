import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session-cookie";

export { SESSION_COOKIE };

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
