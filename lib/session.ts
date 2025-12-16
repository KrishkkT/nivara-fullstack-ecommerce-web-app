import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { nanoid } from "nanoid"

// Use a strong secret key from environment variables
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || process.env.VERCEL_JWT_SECRET || "fallback-secret-key-change-this-in-production-use-a-long-random-string")

// Session timeout - 7 days
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 // 7 days in seconds

export interface SessionData {
  userId: number
  email: string
  role: string
  sessionId: string // Unique session identifier for invalidation
  issuedAt: number
}

export async function createSession(data: Omit<SessionData, "sessionId" | "issuedAt">): Promise<string> {
  const sessionId = nanoid() // Generate unique session ID
  
  const sessionData: SessionData = {
    ...data,
    sessionId,
    issuedAt: Math.floor(Date.now() / 1000)
  }
  
  return new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TIMEOUT)
    .sign(SECRET_KEY)
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    const sessionData = verified.payload as SessionData
    
    // Check if session has expired
    const now = Math.floor(Date.now() / 1000)
    if (now > sessionData.issuedAt + SESSION_TIMEOUT) {
      return null
    }
    
    return sessionData
  } catch (err) {
    return null
  }
}

export async function verifyAuth(token: string): Promise<SessionData | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    const sessionData = verified.payload as SessionData
    
    // Check if session has expired
    const now = Math.floor(Date.now() / 1000)
    if (now > sessionData.issuedAt + SESSION_TIMEOUT) {
      return null
    }
    
    return sessionData
  } catch (err) {
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

// Set secure session cookie - simplified version
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TIMEOUT,
    path: "/" // Ensure path is set to root
  })
}