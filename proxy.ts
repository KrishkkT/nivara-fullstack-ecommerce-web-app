import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

// Proper authentication middleware
export async function proxy(request: NextRequest) {
  // Read session token from cookies
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=')
    acc[name] = value
    return acc
  }, {} as Record<string, string>)
  
  const token = cookies['session']

  // Check if accessing protected routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/account") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname === "/cart" ||
    request.nextUrl.pathname.startsWith("/orders")

  // If not a protected route, allow
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // For protected routes, check authentication
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    // Parse session token manually since we can't use cookies() in middleware
    const sessionData = JSON.parse(atob(token))
    
    // Check if session is still valid
    if (sessionData.expires && new Date(sessionData.expires) < new Date()) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  } catch (error) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/account/:path*", "/cart", "/checkout", "/orders/:path*"],
}