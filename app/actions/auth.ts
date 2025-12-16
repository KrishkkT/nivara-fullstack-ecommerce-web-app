"use server"

import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import { createSimpleSession, setSimpleSessionCookie } from "@/lib/session"

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Simple validation
    if (!email || !password) {
      return { error: "Email and password required" }
    }

    // Get user from database
    const result = await sql`
      SELECT id, email, password_hash FROM users WHERE email = ${email}
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
    const token = await createSimpleSession(user.id, user.email)
    await setSimpleSessionCookie(token)

    // Return success - client will handle redirect
    return { success: true }
  } catch (error) {
    return { error: "Sign in failed" }
  }
}

export async function signUp(formData: FormData) {
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
      RETURNING id, email
    `

    const user = result[0]

    // Create and set session
    const token = await createSimpleSession(user.id, user.email)
    await setSimpleSessionCookie(token)

    // Return success - client will handle redirect
    return { success: true }
  } catch (error) {
    return { error: "Sign up failed" }
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  // Client will handle redirect
  return { success: true }
}