import { cookies } from "next/headers"

// Simple session management with cookie handling
export async function getSession() {
  try {
    let token = null
    try {
      const cookieStore = await cookies()
      token = cookieStore.get("session")?.value
      console.log("Retrieved session token from cookies:", token)
    } catch (e) {
      console.log("Error retrieving session token from cookies:", e)
      return null
    }

    if (!token) {
      console.log("No session token found in cookies")
      return null
    }

    // Parse the session token
    const sessionData = JSON.parse(atob(token))
    console.log("Parsed session data:", sessionData)
    
    // Check if session is still valid
    if (sessionData.expires && new Date(sessionData.expires) < new Date()) {
      console.log("Session expired, removing cookie")
      // Session expired, remove the cookie
      try {
        const cookieStore = await cookies()
        cookieStore.delete("session")
      } catch (e) {
        // Ignore errors
        console.log("Error deleting expired session cookie:", e)
      }
      return null
    }

    console.log("Valid session found")
    return {
      userId: sessionData.userId,
      email: sessionData.email,
      fullName: sessionData.fullName,
    }
  } catch (err) {
    console.log("Error parsing session token:", err)
    // If there's an error parsing the session, remove the invalid cookie
    try {
      const cookieStore = await cookies()
      cookieStore.delete("session")
    } catch (e) {
      // Ignore errors
      console.log("Error deleting invalid session cookie:", e)
    }
    return null
  }
}

// Auth verification function for admin routes
export async function verifyAuth(token: string) {
  try {
    if (!token) {
      console.log("No token provided for verification")
      return null
    }

    console.log("Verifying auth token:", token)

    // Parse the session token
    const sessionData = JSON.parse(atob(token))
    console.log("Parsed token data:", sessionData)
    
    // Check if session is still valid
    if (sessionData.expires && new Date(sessionData.expires) < new Date()) {
      console.log("Token expired")
      return null
    }

    console.log("Token verified successfully")
    return {
      userId: sessionData.userId,
      email: sessionData.email,
      fullName: sessionData.fullName,
    }
  } catch (err) {
    console.log("Error verifying token:", err)
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
  
  console.log("Creating session token for user:", sessionData)
  
  // Encode as base64 JSON string
  return btoa(JSON.stringify(sessionData))
}

// Set session cookie properly
export async function setSessionCookie(token: string) {
  try {
    console.log("Setting session cookie with token:", token)
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      // Remove domain setting to avoid issues with localhost vs production domains
    })
    console.log("Session cookie set successfully")
  } catch (e) {
    console.warn("Failed to set session cookie:", e)
  }
}

// Delete session cookie
export async function deleteSessionCookie() {
  try {
    console.log("Deleting session cookie")
    const cookieStore = await cookies()
    cookieStore.delete("session")
    console.log("Session cookie deleted successfully")
  } catch (e) {
    console.warn("Failed to delete session cookie:", e)
  }
}