"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { nanoid } from "nanoid"

// Cookie mutation functions - ONLY in server action file
function setSessionCookie(token: string) {
  cookies().set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

// Simple session creation
async function createSimpleSession(userId: number, email: string): Promise<string> {
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

// Simple email validation
function validateAndSanitizeEmail(email: string): string | null {
  if (!email || typeof email !== "string") return null
  const sanitized = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(sanitized) ? sanitized : null
}

// Simple input sanitization
function sanitizeInput(input: string): string | null {
  if (!input || typeof input !== "string") return null
  return input.trim()
}

// Get user by email
async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT id, email, password_hash, full_name FROM users WHERE email = ${email}
  `
  return result.length > 0 ? result[0] : null
}

// Create user
async function createUser(email: string, password: string, fullName: string) {
  const passwordHash = await bcrypt.hash(password, 10)
  const result = await sql`
    INSERT INTO users (email, password_hash, full_name)
    VALUES (${email}, ${passwordHash}, ${fullName})
    RETURNING id, email, full_name
  `
  return result[0]
}

export async function signIn(prevState: any, formData: FormData) {
  const email = validateAndSanitizeEmail(formData.get("email") as string)
  const password = sanitizeInput(formData.get("password") as string)

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = await getUserByEmail(email)
  if (!user) {
    return { error: "Invalid email or password" }
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return { error: "Invalid email or password" }
  }

  const token = await createSimpleSession(user.id, user.email)
  setSessionCookie(token) // Allowed here

  redirect("/account") // LAST LINE
}

export async function signUp(prevState: any, formData: FormData) {
  const email = validateAndSanitizeEmail(formData.get("email") as string)
  const password = sanitizeInput(formData.get("password") as string)
  const fullName = sanitizeInput(formData.get("fullName") as string)

  if (!email || !password || !fullName) {
    return { error: "All fields are required" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return { error: "Email already registered" }
  }

  const user = await createUser(email, password, fullName)

  const token = await createSimpleSession(user.id, user.email)
  setSessionCookie(token) // Allowed here

  redirect("/account") // LAST LINE
}

export async function signOut() {
  "use server"
  cookies().delete("session")
  redirect("/")
}