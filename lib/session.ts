import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SignJWT, jwtVerify } from "jose"
import { sql, pooledQuery } from "@/lib/db"

// Secret key for signing JWT tokens (should be at least 256 bits)
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || process.env.NEXT_PUBLIC_SITE_URL || "fallback_secret_key_for_development_only_do_not_use_in_production"
)

// Session expiration time (7 days)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

// Session interface
interface SessionData {
  userId: number
  email: string
  fullName: string
  role: string
  iat: number
  exp: number
}

// Create a signed session token with enhanced security
export async function createSessionToken(userId: number, email: string, fullName: string, role: string = 'customer'): Promise<string> {
  const sessionData = {
    userId,
    email,
    fullName,
    role,
  }
  
  console.log("Creating signed session token for user:", sessionData)
  
  // Create JWT token with expiration
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + (SESSION_DURATION / 1000)
  
  const jwt = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(JWT_SECRET)
  
  return jwt
}

// Verify session token
export async function verifySessionToken(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionData
  } catch (err) {
    console.log("Error verifying session token:", err)
    return null
  }
}

// Get current session
export async function getSession() {
  try {
    let token = null
    try {
      const cookieStore = await cookies()
      token = cookieStore.get("session")?.value
      console.log("Retrieved session token from cookies:", token)
    } catch (e) {
      console.log("Error retrieving session token from cookies:", e)
      return null
    }

    if (!token) {
      console.log("No session token found in cookies")
      return null
    }

    // Verify the session token
    const sessionData = await verifySessionToken(token)
    if (!sessionData) {
      console.log("Invalid session token, removing cookie")
      // Remove invalid cookie
      try {
        const cookieStore = await cookies()
        cookieStore.delete("session")
      } catch (e) {
        console.log("Error deleting invalid session cookie:", e)
      }
      return null
    }

    console.log("Valid session found")
    return {
      userId: sessionData.userId,
      email: sessionData.email,
      fullName: sessionData.fullName,
      role: sessionData.role,
    }
  } catch (err) {
    console.log("Error parsing session token:", err)
    // If there's an error parsing the session, remove the invalid cookie
    try {
      const cookieStore = await cookies()
      cookieStore.delete("session")
    } catch (e) {
      console.log("Error deleting invalid session cookie:", e)
    }
    return null
  }
}

// Auth verification function for admin routes
export async function verifyAuth(token: string) {
  try {
    if (!token) {
      console.log("No token provided for verification")
      return null
    }

    console.log("Verifying auth token:", token)

    // Verify the session token
    const sessionData = await verifySessionToken(token)
    if (!sessionData) {
      console.log("Invalid auth token")
      return null
    }

    console.log("Token verified successfully")
    return {
      userId: sessionData.userId,
      email: sessionData.email,
      fullName: sessionData.fullName,
      role: sessionData.role,
    }
  } catch (err) {
    console.log("Error verifying token:", err)
    return null
  }
}

// Set session cookie with improved security settings
export async function setSessionCookie(token: string) {
  try {
    console.log("Setting session cookie with token:", token)
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION / 1000, // Convert to seconds
    })
    console.log("Session cookie set successfully")
  } catch (e) {
    console.warn("Failed to set session cookie:", e)
  }
}

// Delete session cookie
export async function deleteSessionCookie() {
  try {
    console.log("Deleting session cookie")
    const cookieStore = await cookies()
    cookieStore.delete("session")
    console.log("Session cookie deleted successfully")
  } catch (e) {
    console.warn("Failed to delete session cookie:", e)
  }
}

// Refresh session to extend expiration
export async function refreshSession() {
  try {
    const session = await getSession()
    if (!session) return null

    // Create a new token with extended expiration
    const newToken = await createSessionToken(
      session.userId,
      session.email,
      session.fullName,
      session.role
    )

    await setSessionCookie(newToken)
    return session
  } catch (e) {
    console.warn("Failed to refresh session:", e)
    return null
  }
}

// Server-side authentication check for protected routes
export async function requireAuth(redirectTo: string = "/login") {
  const session = await getSession()
  if (!session) {
    redirect(redirectTo)
  }
  return session
}

// Server-side authorization check for admin routes
export async function requireAdminAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    redirect("/login?redirect=/admin")
  }

  const user = await verifyAuth(token)
  if (!user || user.role !== "admin") {
    redirect("/")
  }
  
  return user
}