import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { createRazorpayOrder } from "@/lib/razorpay-server"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, orderId } = await request.json()

    const razorpayOrder = await createRazorpayOrder(amount, orderId)

    return NextResponse.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    })
  } catch (error: any) {
    console.error("[v0] Razorpay create order error:", error)
    return NextResponse.json({ error: error.message || "Failed to create payment order" }, { status: 500 })
  }
}
