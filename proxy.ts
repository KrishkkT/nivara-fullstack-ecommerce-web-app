import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAuth } from "@/lib/session"
import { rateLimit } from "@/lib/rate-limit"

export async function proxy(request: NextRequest) {
  // Apply rate limiting to all requests
  const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1'
  const rateLimitResult = rateLimit(ip, 100) // 100 requests per 15 minutes
  
  if (!rateLimitResult.success) {
    return new NextResponse(
      JSON.stringify({ error: 'Too Many Requests' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
        }
      }
    )
  }

  const token = request.cookies.get("session")?.value

  // Check if accessing admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  // Check if accessing protected routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/account") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname === "/cart" ||
    request.nextUrl.pathname.startsWith("/orders")

  // If not a protected route, allow
  if (!isAdminRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  // For protected routes, check authentication
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const user = await verifyAuth(token)

    if (!user) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check admin access
    if (isAdminRoute && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/cart", "/checkout", "/orders/:path*"],
}