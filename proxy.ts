import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/session"

export async function proxy(request) {
  const token = request.cookies.get("session")?.value

  // Check if accessing admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  // Check if accessing protected routes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/account") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname === "/cart" ||
    request.nextUrl.pathname.startsWith("/orders")

  if (!isAdminRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
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