"use server"

import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

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

    // For now, just redirect to account without setting cookies
    // This is a temporary solution to identify the issue
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

    // For now, just redirect to account without setting cookies
    // This is a temporary solution to identify the issue
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
  // For now, just redirect to home without deleting cookies
  redirect("/")
}