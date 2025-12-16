import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

export interface Session {
  userId: number
  email: string
  role: string
  fullName: string
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET), {
      issuer: 'nivara-app'
    })
    return payload as Session
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}

export async function verifyAuth(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET), {
      issuer: 'nivara-app'
    })
    return payload as Session
  } catch (error) {
    return null
  }
}