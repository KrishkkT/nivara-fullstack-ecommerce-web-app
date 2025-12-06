import { type NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json()

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const secret = process.env.RAZORPAY_KEY_SECRET!

    const generated_signature = createHmac("sha256", secret).update(text).digest("hex")

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Update order with payment details
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

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: error.message || "Payment verification failed" }, { status: 500 })
  }
}
