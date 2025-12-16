import { cookies } from "next/headers"

// Simple session management with cookie handling
export async function getSession() {
  try {
    let token = null
    try {
      token = cookies().get("session")?.value
    } catch (e) {
      return null
    }

    if (!token) {
      return null
    }

    // Parse the session token
    const sessionData = JSON.parse(atob(token))
    
    // Check if session is still valid
    if (sessionData.expires && new Date(sessionData.expires) < new Date()) {
      // Session expired, remove the cookie
      try {
        cookies().delete("session")
      } catch (e) {
        // Ignore errors
      }
      return null
    }

    return {
      userId: sessionData.userId,
      email: sessionData.email,
      fullName: sessionData.fullName,
    }
  } catch (err) {
    // If there's an error parsing the session, remove the invalid cookie
    try {
      cookies().delete("session")
    } catch (e) {
      // Ignore errors
    }
    return null
  }
}

// Auth verification function for admin routes
export async function verifyAuth(token: string) {
  try {
    if (!token) {
      return null
    }

    // Parse the session token
    const sessionData = JSON.parse(atob(token))
    
    // Check if session is still valid
    if (sessionData.expires && new Date(sessionData.expires) < new Date()) {
      return null
    }

    return {
      userId: sessionData.userId,
      email: sessionData.email,
      fullName: sessionData.fullName,
    }
  } catch (err) {
    return null
  }
}

// Create a session token
export function createSessionToken(userId: number, email: string, fullName: string): string {
  const sessionData = {
    userId,
    email,
    fullName,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
  }
  
  // Encode as base64 JSON string
  return btoa(JSON.stringify(sessionData))
}

// Set session cookie properly
export function setSessionCookie(token: string) {
  try {
    const cookieStore = cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  } catch (e) {
    console.warn("Failed to set session cookie:", e)
  }
}

// Delete session cookie
export function deleteSessionCookie() {
  try {
    const cookieStore = cookies()
    cookieStore.delete("session")
  } catch (e) {
    console.warn("Failed to delete session cookie:", e)
  }
}