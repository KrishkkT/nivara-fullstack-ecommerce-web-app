import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/session"

export async function proxy(request: NextRequest) {
  // Read session token from cookies
  const token = request.cookies.get("session")?.value

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
    const user = await verifyAuth(token)

    if (!user) {
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