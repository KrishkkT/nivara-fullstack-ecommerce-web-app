// Simple session management - no cookies, no JWT
export async function getSession() {
  // For now, return null to avoid cookie issues
  // We'll handle user state differently
  return null
}

export async function verifyAuth(token: string) {
  // For now, return null to avoid cookie issues
  return null
}