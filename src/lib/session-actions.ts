"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/session-cookie";

const ADMIN_VALUE = "admin";
const PARALEGAL_VALUE = "paralegal";

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
  await setSessionCookie(ADMIN_VALUE);
  redirect("/");
}

export async function signInTemporaryParalegal() {
  await setSessionCookie(PARALEGAL_VALUE);
  redirect("/");
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}
