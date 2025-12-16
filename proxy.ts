import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Disabled middleware - removed to fix authentication issues
export async function proxy(request: NextRequest) {
  // Allow all requests to pass through without authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: [],
}