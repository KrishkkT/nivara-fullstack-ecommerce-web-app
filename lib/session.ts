import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { nanoid } from "nanoid"

// Simple session creation
export async function createSimpleSession(userId: number, email: string): Promise<string> {
  const secret = new TextEncoder().encode("simple-secret-key")
  const sessionData = {
    userId,
    email,
    sessionId: nanoid(),
    issuedAt: Math.floor(Date.now() / 1000)
  }
  
  return new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(7 * 24 * 60 * 60) // 7 days
    .sign(secret)
}

// Simple session cookie setting - FIXED for middleware visibility
export function setSimpleSessionCookie(token: string) {
  cookies().set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",     // REQUIRED
    maxAge: 60 * 60 * 24 * 7,
  })
}

// Simple session verification
export async function getSession() {
  try {
    const token = cookies().get("session")?.value

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

// Restore verifyAuth for other modules that depend on it
export async function verifyAuth(token: string) {
  try {
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