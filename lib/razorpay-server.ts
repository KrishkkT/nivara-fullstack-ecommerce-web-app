export async function createRazorpayOrder(amount: number, orderId: number) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  console.log("[v0] Creating Razorpay order with credentials:", {
    keyId: keyId ? `${keyId.substring(0, 10)}...` : null,
    keySecret: keySecret ? `${keySecret.substring(0, 10)}...` : null,
    amount,
    orderId
  })

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.",
    )
  }

  if (!keyId.startsWith("rzp_test_") && !keyId.startsWith("rzp_live_")) {
    throw new Error("Invalid Razorpay Key ID format. It should start with 'rzp_test_' or 'rzp_live_'.")
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64")
  console.log("[v0] Razorpay auth header prepared")

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `order_${orderId}`,
      notes: {
        orderId: orderId.toString(),
      },
    }),
  })

  console.log("[v0] Razorpay API response status:", response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] Razorpay API error response:", errorText)
    
    if (response.status === 401) {
      throw new Error(
        "Razorpay authentication failed. Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct.",
      )
    }
    
    throw new Error(`Razorpay API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  console.log("[v0] Razorpay order created successfully:", {
    id: data.id,
    amount: data.amount,
    currency: data.currency
  })
  return data
}

export async function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): Promise<boolean> {
  const crypto = await import("crypto")
  const secret = process.env.RAZORPAY_KEY_SECRET!

  const body = razorpayOrderId + "|" + razorpayPaymentId
  const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex")

  return expectedSignature === razorpaySignature
}