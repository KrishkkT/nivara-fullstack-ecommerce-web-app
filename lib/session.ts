import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { nanoid } from "nanoid"

// Simple session verification - READ ONLY
export async function getSession() {
  try {
    const token = cookies().get("session")?.value

    if (!token) {
      return null
    }

    const secret = new TextEncoder().encode("simple-secret-key")
    const verified = await jwtVerify(token, secret)
    const sessionData = verified.payload

    return {
      userId: sessionData.userId,
      email: sessionData.email,
    }
  } catch (err) {
    return null
  }
}

// Simple auth verification - READ ONLY
export async function verifyAuth(token: string) {
  try {
    if (!token) {
      return null
    }

    const secret = new TextEncoder().encode("simple-secret-key")
    const verified = await jwtVerify(token, secret)
    const sessionData = verified.payload

    return {
      userId: sessionData.userId,
      email: sessionData.email,
    }
  } catch (err) {
    return null
  }
}