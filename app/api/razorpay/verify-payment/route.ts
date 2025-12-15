import { type NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Razorpay verify payment API called")
    const session = await getSession()

    if (!session) {
      console.log("[v0] Unauthorized access to Razorpay verify payment API")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Verification request body:", body)
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body

    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      console.log("[v0] Missing required parameters for verification")
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const secret = process.env.RAZORPAY_KEY_SECRET!
    
    if (!secret) {
      console.error("[v0] Razorpay key secret not configured")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const generated_signature = createHmac("sha256", secret).update(text).digest("hex")
    console.log("[v0] Signature verification:", {
      received: razorpay_signature,
      generated: generated_signature,
      match: generated_signature === razorpay_signature
    })

    if (generated_signature !== razorpay_signature) {
      console.log("[v0] Invalid signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Update order with payment details
    console.log("[v0] Updating order with payment details")
    await sql`
      UPDATE orders
      SET 
        payment_status = 'paid',
        status = 'processing',
        razorpay_order_id = ${razorpay_order_id},
        razorpay_payment_id = ${razorpay_payment_id},
        razorpay_signature = ${razorpay_signature},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId} AND user_id = ${session.userId}
    `

    console.log("[v0] Order updated successfully")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: error.message || "Payment verification failed" }, { status: 500 })
  }
}