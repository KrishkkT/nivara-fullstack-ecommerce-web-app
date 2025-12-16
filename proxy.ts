import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function proxy(request) {
  const token = request.cookies.get("session")?.value

  // Protected routes
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/account") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname === "/cart" ||
    request.nextUrl.pathname.startsWith("/orders")

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const session = await getSession()
    if (!session) {
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