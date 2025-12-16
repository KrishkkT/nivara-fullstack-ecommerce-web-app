"use server"

import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { createSessionToken, setSessionCookie } from "@/lib/session"
import { hashPassword, verifyPassword } from "@/lib/auth"

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Simple validation
    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    // Get user from database
    const result = await sql`
      SELECT id, email, password_hash, full_name FROM users WHERE email = ${email}
    `

    if (result.length === 0) {
      return { error: "Invalid email or password" }
    }

    const user = result[0]

    // Check password using SHA-256
    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      return { error: "Invalid email or password" }
    }

    // Create and set session
    const token = createSessionToken(user.id, user.email, user.full_name)
    setSessionCookie(token)

    // Return success - client will handle redirect
    return { success: true }
  } catch (error) {
    console.error("Sign in error:", error)
    return { error: "Failed to sign in. Please try again." }
  }
}

export async function signUp(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    // Simple validation
    if (!email || !password || !fullName) {
      return { error: "All fields are required" }
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters" }
    }

    // Check if user exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existing.length > 0) {
      return { error: "An account with this email already exists" }
    }

    // Hash password using SHA-256
    const passwordHash = await hashPassword(password)

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName})
      RETURNING id, email, full_name
    `

    const user = result[0]

    // Create and set session
    const token = createSessionToken(user.id, user.email, user.full_name)
    setSessionCookie(token)

    // Return success - client will handle redirect
    return { success: true }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "Failed to create account. Please try again." }
  }
}

export async function signOut() {
  "use server"
  // Import the delete function
  const { deleteSessionCookie } = await import("@/lib/session")
  deleteSessionCookie()
  redirect("/")
}