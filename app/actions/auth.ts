"use server"

import { redirect } from "next/navigation"
import { sql, pooledQuery } from "@/lib/db"
import { createSessionToken, setSessionCookie, refreshSession } from "@/lib/session"
import bcrypt from "bcryptjs"
import { sendEmail, generateWelcomeEmail } from "@/lib/email"

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

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("Validation failed: Invalid email format")
      return { error: "Invalid email format" }
    }

    // Get user from database using pooled query for better performance
    const result = await pooledQuery(
      'SELECT id, email, password_hash, full_name, role FROM users WHERE email = $1',
      [email]
    )

    console.log("Database query result:", result)

    if (result.rowCount === 0) {
      console.log("No user found with this email")
      return { error: "Invalid email or password" }
    }

    const user = result.rows[0]

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
    const token = await createSessionToken(user.id, user.email, user.full_name, user.role)
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

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("Validation failed: Invalid email format")
      return { error: "Invalid email format" }
    }

    if (password.length < 8) {
      console.log("Validation failed: Password too short")
      return { error: "Password must be at least 8 characters" }
    }

    // Check if user exists using pooled query
    const existing = await pooledQuery(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    console.log("Existing user check result:", existing)

    if (existing.rowCount > 0) {
      console.log("User already exists with this email")
      return { error: "An account with this email already exists" }
    }

    // Hash password using bcrypt
    const passwordHash = await bcrypt.hash(password, 12)
    console.log("Password hashed with bcrypt")

    // Create user using pooled query
    const result = await pooledQuery(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [email, passwordHash, fullName, 'customer']
    )

    console.log("User created:", result)

    const user = result.rows[0]

    // Send welcome email
    try {
      console.log(`[v0] Sending welcome email to new user ${email}`);
      const emailHtml = generateWelcomeEmail(user);
      await sendEmail({
        to: email,
        subject: "Welcome to NIVARA!",
        html: emailHtml
      });
      console.log(`[v0] Welcome email sent successfully to ${email}`);
    } catch (emailError) {
      console.error("[v0] Failed to send welcome email:", emailError);
    }

    // Create and set session
    const token = await createSessionToken(user.id, user.email, user.full_name, user.role)
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

// Function to check if user is authenticated and refresh session if needed
export async function checkAuth() {
  try {
    // This will automatically refresh the session if it's close to expiring
    const session = await refreshSession()
    return session
  } catch (error) {
    console.error("Auth check error:", error)
    return null
  }
}