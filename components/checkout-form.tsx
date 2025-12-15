"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createOrder } from "@/app/actions/orders"
// SWR import removed due to typing issues

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

    setLoading(false)

    if (result.error) {
      alert(result.error)
    } else if (result.orderId) {
      // Redirect to payment page
      router.push(`/orders/${result.orderId}`)
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

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </Button>
    </form>
  )
}