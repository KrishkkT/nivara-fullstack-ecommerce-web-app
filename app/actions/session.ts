"use server"

import { refreshSession } from "@/lib/session"

// Server action to refresh the session
export async function refreshUserSession() {
  try {
    const session = await refreshSession()
    return { success: true, session }
  } catch (error) {
    console.error("Session refresh error:", error)
    return { success: false, error: "Failed to refresh session" }
  }
}