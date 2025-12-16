import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Simplified middleware - allow access to account page temporarily
export async function proxy(request: NextRequest) {
  // For now, allow all requests to pass through
  // We'll implement proper authentication later
  return NextResponse.next()
}

export const config = {
  matcher: [],
}