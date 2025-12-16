"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { nanoid } from "nanoid"

// Create session token
async function createSession(userId: number, email: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_for_development")
  const sessionData = {
    userId,
    email,
    sessionId: nanoid(),
  }
  
  return new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

// Set session cookie with proper domain
function setSessionCookie(token: string) {
  cookies().set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    domain: ".nivarasilver.in",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function signIn(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Simple validation
    if (!email || !password) {
      return { error: "Email and password required" }
    }

    // Get user from database
    const result = await sql`
      SELECT id, email, password_hash, full_name FROM users WHERE email = ${email}
    `

    if (result.length === 0) {
      return { error: "Invalid credentials" }
    }

    const user = result[0]

    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return { error: "Invalid credentials" }
    }

    // Create and set session
    const token = await createSession(user.id, user.email)
    setSessionCookie(token)

    // Redirect to account
    redirect("/account")
  } catch (error) {
    // NEXT_REDIRECT is expected and should not be caught
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error("Sign in error:", error)
    return { error: "Failed to sign in" }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    // Simple validation
    if (!email || !password || !fullName) {
      return { error: "All fields required" }
    }

    if (password.length < 8) {
      return { error: "Password too short" }
    }

    // Check if user exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existing.length > 0) {
      return { error: "Email taken" }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName})
      RETURNING id, email, full_name
    `

    const user = result[0]

    // Create and set session
    const token = await createSession(user.id, user.email)
    setSessionCookie(token)

    // Redirect to account
    redirect("/account")
  } catch (error) {
    // NEXT_REDIRECT is expected and should not be caught
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }
    console.error("Sign up error:", error)
    return { error: "Failed to create account" }
  }
}

export async function signOut() {
  "use server"
  cookies().delete("session")
  redirect("/")
}