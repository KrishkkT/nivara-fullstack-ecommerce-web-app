// Disabled middleware - removed to fix authentication issues
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Minimal proxy function that allows all requests
// This replaces the previous authentication middleware
export async function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}