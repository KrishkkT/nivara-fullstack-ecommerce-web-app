import { cookies } from "next/headers"
import { jwtVerify } from "jose"

// Simple session verification
export async function getSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value

    if (!token) {
      return null
    }

    const secret = new TextEncoder().encode("simple-secret-key")
    const verified = await jwtVerify(token, secret)
    const sessionData = verified.payload

    // Check if session is expired (7 days)
    const now = Math.floor(Date.now() / 1000)
    if (now > (sessionData.issuedAt as number) + (7 * 24 * 60 * 60)) {
      return null
    }

    return {
      userId: sessionData.userId,
      email: sessionData.email,
      role: sessionData.role || "customer"
    }
  } catch (err) {
    return null
  }
}
