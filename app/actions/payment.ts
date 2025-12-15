"use server"

export async function getRazorpayPublicKey() {
  // This server action safely returns the public Razorpay key
  // NEXT_PUBLIC_ keys are safe to expose, but using server action is more secure
  console.log("[v0] Getting Razorpay public key")
  const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
  console.log("[v0] Razorpay public key:", key)
  return key
}