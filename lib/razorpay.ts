import Razorpay from "razorpay"

// Lazy initialization - only check for Razorpay credentials when it's actually used
let razorpayInstance: Razorpay | null = null

export const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error(
      "Razorpay credentials are not set. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.",
    )
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }

  return razorpayInstance
}

// For backward compatibility, export a proxy function
export const razorpay = new Proxy({}, {
  get(_target, prop) {
    const instance = getRazorpay()
    // @ts-ignore
    return instance[prop]
  }
}) as Razorpay