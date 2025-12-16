"use server"

import { cookies } from "next/headers"
import { getUserByEmail, verifyPassword } from "@/lib/auth"
import { createSession, setSessionCookie } from "@/lib/session"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return { error: "Invalid email or password" }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return { error: "Invalid email or password" }
    }

    // Create session
    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set secure session cookie
    await setSessionCookie(token)

    // Redirect to account page
    redirect("/account")
  } catch (error) {
    return { error: "Failed to sign in" }
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  if (!email || !password || !fullName) {
    return { error: "All fields are required" }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return { error: "Email already registered" }
    }

    // Hash password
    const bcrypt = await import("bcryptjs")
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const userResult = await sql`
      INSERT INTO users (email, password_hash, full_name)
      VALUES (${email}, ${passwordHash}, ${fullName})
      RETURNING id, email, full_name, role
    `

    const user = userResult[0]

    // Create session
    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Set secure session cookie
    await setSessionCookie(token)

    // Redirect to account page
    redirect("/account")
  } catch (error) {
    return { error: "Failed to create account" }
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  redirect("/")
}