"use server"

export async function getRazorpayPublicKey() {
  // This server action safely returns the public Razorpay key
  // NEXT_PUBLIC_ keys are safe to expose, but using server action is more secure
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
}
