import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Extremely simplified middleware for debugging
export async function proxy(request: NextRequest) {
  // Allow all requests for now to isolate the login issue
  return NextResponse.next()
}

export const config = {
  matcher: [],
}