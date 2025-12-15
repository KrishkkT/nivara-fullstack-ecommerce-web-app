"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createOrder } from "@/app/actions/orders"
import { getRazorpayPublicKey } from "@/app/actions/payment"

interface Address {
  id: number
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export function CheckoutForm({
  user,
  addresses,
  cartItems,
  total,
}: {
  user: any
  addresses: Address[]
  cartItems: any[]
  total: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id?.toString() || "new")
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [razorpayKey, setRazorpayKey] = useState<string>("")
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      setScriptLoaded(true)
    }
    script.onerror = () => {
      setScriptError(true)
    }
    document.body.appendChild(script)

    // Get Razorpay public key
    getRazorpayPublicKey().then((key) => {
      setRazorpayKey(key)
    })

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  async function handleRazorpayPayment(orderId: number, orderNumber: string) {
    if (!scriptLoaded || !razorpayKey || !window.Razorpay) {
      alert("Payment system is not ready. Please try again.")
      return
    }

    setLoading(true)

    try {
      // Create Razorpay order
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          orderId: orderId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment order")
      }

      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        name: "NIVARA",
        description: `Order ${orderNumber}`,
        order_id: data.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
              // Refresh the page to show updated order status
              router.push(`/orders/${orderId}`)
              router.refresh()
            } else {
              alert("Payment verification failed. Please contact support.")
            }
          } catch (verifyError) {
            alert("Payment verification failed. Please contact support.")
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
        prefill: {
          name: user.full_name,
          email: user.email,
        },
        theme: {
          color: "#B29789",
        },
      }

      const razorpayInstance = new window.Razorpay(options)

      razorpayInstance.on("payment.failed", (response: any) => {
        alert(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })

      razorpayInstance.open()
    } catch (error: any) {
      alert(error.message || "Payment failed. Please try again.")
      setLoading(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    // Get address data
    let addressData
    let addressId = null
    if (selectedAddress === "new") {
      addressData = {
        address_line1: formData.get("address_line1") as string,
        address_line2: formData.get("address_line2") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        postal_code: formData.get("postal_code") as string,
        country: "India",
      }
    } else {
      const addr = addresses.find((a) => a.id.toString() === selectedAddress)
      if (addr) {
        addressId = addr.id
        addressData = {
          address_line1: addr.address_line1,
          address_line2: addr.address_line2,
          city: addr.city,
          state: addr.state,
          postal_code: addr.postal_code,
          country: addr.country,
        }
      }
    }

    const result = await createOrder({
      items: cartItems.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: Number.parseFloat(item.price),
      })),
      shippingAddress: addressData,
      shippingAddressId: addressId,
      paymentMethod,
      totalAmount: total,
    })

    if (result.error) {
      alert(result.error)
      setLoading(false)
    } else if (result.orderId && result.orderNumber) {
      // Directly initiate Razorpay payment
      await handleRazorpayPayment(result.orderId, result.orderNumber)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user.full_name} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user.email} readOnly />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Shipping Address</h2>

        {addresses.length > 0 && (
          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
            {addresses.map((address) => (
              <div key={address.id} className="flex items-start space-x-2 border rounded p-3">
                <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                <Label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                  <div className="font-medium">{address.address_line1}</div>
                  {address.address_line2 && (
                    <div className="text-sm text-muted-foreground">{address.address_line2}</div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.postal_code}
                  </div>
                  {address.is_default && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-1 inline-block">
                      Default
                    </span>
                  )}
                </Label>
              </div>
            ))}

            <div className="flex items-start space-x-2 border rounded p-3">
              <RadioGroupItem value="new" id="address-new" />
              <Label htmlFor="address-new" className="cursor-pointer">
                Use a new address
              </Label>
            </div>
          </RadioGroup>
        )}

        {selectedAddress === "new" && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="address_line1">Address Line 1 *</Label>
              <Input id="address_line1" name="address_line1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_line2">Address Line 2</Label>
              <Input id="address_line2" name="address_line2" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input id="state" name="state" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code *</Label>
                <Input id="postal_code" name="postal_code" required />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Payment Method</h2>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2 border rounded p-3">
            <RadioGroupItem value="razorpay" id="payment-razorpay" />
            <Label htmlFor="payment-razorpay" className="flex-1 cursor-pointer">
              <div className="font-medium">Online</div>
              <div className="text-sm text-muted-foreground">Secure online payment via Razorpay</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="w-full" 
        disabled={loading || !scriptLoaded || scriptError}
      >
        {loading ? "Processing..." : "Place Order"}
      </Button>
      {(scriptError || !scriptLoaded) && (
        <p className="text-xs text-muted-foreground text-center">
          {scriptError ? "Payment system failed to load." : "Payment system is loading..."}
        </p>
      )}
    </form>
  )
}