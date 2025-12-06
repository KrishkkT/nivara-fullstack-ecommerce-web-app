// This script generates the SHA-256 hash for the admin password
// Run this if you need to generate a new password hash

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

// Generate hash for "admin123"
const password = "Nivara$Jewels"
hashPassword(password).then((hash) => {
  console.log(`Password: ${password}`)
  console.log(`Hash: ${hash}`)
})
