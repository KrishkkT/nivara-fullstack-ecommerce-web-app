import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { createRazorpayOrder } from "@/lib/razorpay-server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Razorpay create order API called")
    const session = await getSession()

    if (!session) {
      console.log("[v0] Unauthorized access to Razorpay create order API")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Request body:", body)
    
    const { amount, orderId } = body

    if (!amount || !orderId) {
      console.log("[v0] Missing required parameters")
      return NextResponse.json({ error: "Missing amount or orderId" }, { status: 400 })
    }

    const razorpayOrder = await createRazorpayOrder(amount, orderId)
    console.log("[v0] Razorpay order created:", razorpayOrder)

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