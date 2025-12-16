"use server"

import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { createSessionToken, setSessionCookie } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Sign in attempt for email:", email)

    // Simple validation
    if (!email || !password) {
      console.log("Validation failed: Email or password missing")
      return { error: "Email and password are required" }
    }

    // Get user from database
    const result = await sql`
      SELECT id, email, password_hash, full_name FROM users WHERE email = ${email}
    `

    console.log("Database query result:", result)

    if (result.length === 0) {
      console.log("No user found with this email")
      return { error: "Invalid email or password" }
    }

    const user = result[0]

    // Check if user needs to reset password
    if (user.password_hash === 'RESET_REQUIRED') {
      console.log("User needs to reset password")
      return { error: "Please reset your password using the 'Forgot Password' link" }
    }

    // Check password using bcrypt
    const isValid = await bcrypt.compare(password, user.password_hash)
    console.log("Password validation result:", isValid)
    
    if (!isValid) {
      console.log("Invalid password")
      return { error: "Invalid email or password" }
    }

    // Create and set session
    const token = createSessionToken(user.id, user.email, user.full_name)
    console.log("Created session token")
    
    await setSessionCookie(token)
    console.log("Set session cookie")

    // Return success - client will handle redirect
    console.log("Sign in successful")
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

    console.log("Sign up attempt for email:", email)

    // Simple validation
    if (!email || !password || !fullName) {
      console.log("Validation failed: Missing required fields")
      return { error: "All fields are required" }
    }

    if (password.length < 8) {
      console.log("Validation failed: Password too short")
      return { error: "Password must be at least 8 characters" }
    }

    // Check if user exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    console.log("Existing user check result:", existing)

    if (existing.length > 0) {
      console.log("User already exists with this email")
      return { error: "An account with this email already exists" }
    }

    // Hash password using bcrypt
    const passwordHash = await bcrypt.hash(password, 12)
    console.log("Password hashed with bcrypt")

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName})
      RETURNING id, email, full_name
    `

    console.log("User created:", result)

    const user = result[0]

    // Create and set session
    const token = createSessionToken(user.id, user.email, user.full_name)
    console.log("Created session token for new user")
    
    await setSessionCookie(token)
    console.log("Set session cookie for new user")

    // Return success - client will handle redirect
    console.log("Sign up successful")
    return { success: true }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "Failed to create account. Please try again." }
  }
}

export async function signOut() {
  "use server"
  console.log("Sign out initiated")
  // Import the delete function
  const { deleteSessionCookie } = await import("@/lib/session")
  await deleteSessionCookie()
  console.log("Session cookie deleted")
  redirect("/")
}