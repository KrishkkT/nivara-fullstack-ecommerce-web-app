"use server"

import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { createSimpleSession, setSimpleSessionCookie } from "@/lib/session"

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
  await setSimpleSessionCookie(token)

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
  await setSimpleSessionCookie(token)

  redirect("/account") // LAST LINE
}

export async function signOut() {
  const { cookies } = await import("next/headers")
  cookies().delete("session")
  redirect("/")
}