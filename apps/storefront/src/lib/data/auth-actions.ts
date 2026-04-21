// src/lib/data/auth-actions.ts
"use server"

import { sdk } from "@lib/config"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
  await sdk.auth.logout()

  const cookieStore = await cookies()
  cookieStore.delete("_medusa_jwt")

  redirect("/")
}