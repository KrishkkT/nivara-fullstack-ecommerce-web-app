import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { nanoid } from "nanoid"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key")
const SESSION_TIMEOUT = 7 * 24 * 60 * 60

export interface SessionData {
  userId: number
  email: string
  role: string
  sessionId: string
  issuedAt: number
}

export async function createSession(data: Omit<SessionData, "sessionId" | "issuedAt">): Promise<string> {
  const sessionId = nanoid()
  
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
    
    const now = Math.floor(Date.now() / 1000)
    if (now > sessionData.issuedAt + SESSION_TIMEOUT) {
      return null
    }
    
    return sessionData
  } catch (err) {
    return null
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  // Simple cookie setting without complex options
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: false, // Disable secure for development
    sameSite: "lax",
    maxAge: SESSION_TIMEOUT,
    path: "/"
  })
}