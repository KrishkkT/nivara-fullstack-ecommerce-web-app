import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { nanoid } from "nanoid"

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "simple-secret-key")
const SESSION_TIMEOUT = 7 * 24 * 60 * 60

export interface SessionData {
  userId: number
  email: string
  role: string
  sessionId: string
  issuedAt: number
}

export async function createSession(data) {
  const sessionId = nanoid()
  
  const sessionData = {
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

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, SECRET_KEY)
    const sessionData = verified.payload
    
    const now = Math.floor(Date.now() / 1000)
    if (now > sessionData.issuedAt + SESSION_TIMEOUT) {
      return null
    }
    
    return sessionData
  } catch (err) {
    return null
  }
}

export async function setSessionCookie(token) {
  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TIMEOUT,
    path: "/"
  })
}