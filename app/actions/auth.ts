"use server"

import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

// Extremely simple authentication - no sessions, no cookies
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

    // Just redirect to account - no session management
    redirect("/account")
  } catch (error) {
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
    await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName})
    `

    // Just redirect to account - no session management
    redirect("/account")
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "Failed to create account" }
  }
}

export async function signOut() {
  "use server"
  redirect("/")
}