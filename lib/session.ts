import { cookies } from "next/headers"
import { jwtVerify } from "jose"

// Session verification - READ ONLY
export async function getSession() {
  try {
    const token = cookies().get("session")?.value

    if (!token) {
      return null
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_for_development")
    const verified = await jwtVerify(token, secret)
    const sessionData = verified.payload

    return {
      userId: sessionData.userId,
      email: sessionData.email,
      fullName: sessionData.fullName,
    }
  } catch (err) {
    return null
  }
}

// Auth verification - READ ONLY
export async function verifyAuth(token: string) {
  try {
    if (!token) {
      return null
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_for_development")
    const verified = await jwtVerify(token, secret)
    const sessionData = verified.payload

    return {
      userId: sessionData.userId,
      email: sessionData.email,
      fullName: sessionData.fullName,
    }
  } catch (err) {
    return null
  }
}