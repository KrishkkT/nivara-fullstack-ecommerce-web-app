"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { CheckCircle2, Clock, Package, Truck } from "lucide-react"
import { getRazorpayPublicKey } from "@/app/actions/payment"
import { CancelOrderButton } from "./cancel-order-button"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface Order {
  id: number
  order_number: string
  total_amount: string
  status: string
  payment_status: string
  shipping_address: any
  created_at: string
  razorpay_order_id?: string
  payment_type: string
}

interface OrderItem {
  id: number
  product_id: number
  product_name: string
  product_price: string
  quantity: number
  image_url: string
  slug: string
}

// Add this interface for shipment data
interface ShipmentData {
  awb_code: string;
  status: string;
  current_location?: string;
  scan_details?: {
    status: string;
    scan_datetime: string;
    location: string;
    remarks?: string;
  }[];
}

// Add this interface for tracking result
interface TrackingResult {
  shipment_data: ShipmentData[];
}

export function OrderDetails({ order, items }: { order: Order; items: OrderItem[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [razorpayKey, setRazorpayKey] = useState<string>("")
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)
  // Add tracking state
  const [trackingData, setTrackingData] = useState<ShipmentData | null>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [trackingError, setTrackingError] = useState<string | null>(null)

  // Simplified tracking function that works directly with AWB code
  const fetchTrackingByAwb = async (awb_code: string) => {
    setTrackingLoading(true);
    setTrackingError(null);
    
    try {
      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "track-shipment",
          awb_code: awb_code,
        }),
      });
      
      const data: TrackingResult = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to track shipment");
      }
      
      if (data.shipment_data && data.shipment_data.length > 0) {
        setTrackingData(data.shipment_data[0]);
      } else {
        setTrackingError("No tracking data found for this shipment");
      }
    } catch (err) {
      setTrackingError(err instanceof Error ? err.message : "Failed to load tracking information");
    } finally {
      setTrackingLoading(false);
    }
  };

  // Effect to fetch tracking data when order is shipped
  useEffect(() => {
    const loadTrackingData = async () => {
      // Only fetch tracking data for shipped or delivered orders
      if ((order.status === "shipped" || order.status === "delivered") && order.id) {
        try {
          // First, get the AWB code from the database
          const response = await fetch(`/api/orders/${order.id}/tracking`);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || "Failed to fetch tracking data");
          }
          
          if (data.awb_code) {
            // Now fetch the tracking details from Shiprocket
            await fetchTrackingByAwb(data.awb_code);
          }
        } catch (err) {
          setTrackingError(err instanceof Error ? err.message : "Failed to load tracking information");
        }
      }
    };
    
    loadTrackingData();
  }, [order.status, order.id]);

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

    getRazorpayPublicKey().then((key) => setRazorpayKey(key))

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  async function handlePayNow() {
    if (!scriptLoaded) {
      alert("Payment system is still loading. Please wait a moment and try again.")
      return
    }
    
    if (scriptError) {
      alert("Payment system failed to load. Please refresh the page and try again.")
      return
    }

    if (!razorpayKey) {
      alert("Payment system is loading. Please try again in a moment.")
      return
    }

    if (!window.Razorpay) {
      alert("Payment gateway is not ready. Please refresh the page and try again.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number.parseFloat(order.total_amount),
          orderId: order.id,
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
        description: `Order ${order.order_number}`,
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
                orderId: order.id,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
              alert("Payment successful! Your order is being processed.")
              router.push("/orders")
              router.refresh()
            } else {
              alert("Payment verification failed. Please contact support.")
            }
          } catch (verifyError) {
            alert("Payment verification failed. Please contact support.")
          } finally {
            setLoading(false)
            document.body.style.overflow = ""
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            document.body.style.overflow = ""
          },
        },
        prefill: {
          name: order.shipping_address?.name || "",
          email: order.shipping_address?.email || "",
        },
        theme: {
          color: "#B29789",
        },
      }

      const razorpayInstance = new window.Razorpay(options)

      razorpayInstance.on("payment.failed", (response: any) => {
        alert(`Payment failed: ${response.error.description}`)
        setLoading(false)
        document.body.style.overflow = ""
      })

      razorpayInstance.open()
    } catch (error: any) {
      alert(error.message || "Payment failed. Please try again.")
      setLoading(false)
    }
  }

  // Safely handle address - it can be null or undefined
  const address = order.shipping_address || {}
  const statusIcon =
    {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle2,
      cancelled: Clock,
    }[order.status] || Clock

  const StatusIcon = statusIcon

  const paymentMethod = "Online Payment"
  const isCancelled = order.status === "cancelled"
  const showPayNow = !isCancelled && order.payment_type === "razorpay" && order.payment_status === "awaiting_payment"
  const isShipped = order.status === "shipped" || order.status === "delivered"

  // Add helper function for status badges
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Created
        </span>
      case "in_transit":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          In Transit
        </span>
      case "out_for_delivery":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Out for Delivery
        </span>
      case "delivered":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Delivered
        </span>
      case "rto":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Returned
        </span>
      case "ndr":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Action Required
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
    }
  }

  return (
    <div className="container px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif tracking-tight mb-2">Order Details</h1>
            <p className="text-muted-foreground">Order #{order.order_number}</p>
            <p className="text-sm text-muted-foreground">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <StatusIcon className="h-5 w-5 text-primary" />
              <span className="font-medium capitalize">{order.status}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">{paymentMethod}</span>
              {!isCancelled && order.payment_status !== "paid" && (
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  {order.payment_status === "awaiting_payment" ? "Pending Payment" : order.payment_status}
                </span>
              )}
              {order.payment_status === "paid" && (
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800">Paid</span>
              )}
            </div>
          </div>
        </div>

        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm">
              <strong>Your order has been cancelled.</strong> Refund will be processed within 5-7 working days.
            </p>
          </div>
        )}

        {showPayNow && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm mb-3">Complete your payment to process this order</p>
            <Button onClick={handlePayNow} disabled={loading || !razorpayKey || !scriptLoaded || scriptError}>
              {loading ? "Processing..." : "Pay Now"}
            </Button>
            {(scriptError || !scriptLoaded) && (
              <p className="text-xs text-muted-foreground mt-2">
                {scriptError ? "Payment system failed to load." : "Payment system is loading..."}
              </p>
            )}
          </div>
        )}

        {!isCancelled && !isShipped && !showPayNow && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm">
              <strong>Shipping Information:</strong> You will receive a shipping confirmation email at your registered email address once your order is shipped.
            </p>
          </div>
        )}

        {!isCancelled && (order.status === "pending" || order.status === "processing") && (
          <div className="bg-card border rounded-lg p-4">
            <CancelOrderButton orderId={order.id} />
          </div>
        )}

        {/* Show tracking link for shipped orders */}
        {!isCancelled && (order.status === "shipped" || order.status === "delivered") && !trackingData && !trackingLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm mb-3">
              <strong>Your order has been shipped!</strong> You can track your shipment using the link below.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/shipping/track'}>
              Track Shipment
            </Button>
          </div>
        )}

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="font-medium hover:text-primary transition-colors">{item.product_name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{formatPrice(Number.parseFloat(item.product_price))}</p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(Number.parseFloat(item.product_price) * item.quantity)} total
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(Number.parseFloat(order.total_amount))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2">
              <span>Total</span>
              <span>{formatPrice(Number.parseFloat(order.total_amount))}</span>
            </div>
          </div>
        </div>

        {!isCancelled && (order.status === "shipped" || order.status === "delivered") && trackingData && (
          <div className="bg-card border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Shipment Tracking</h2>
              <Button variant="outline" size="sm" onClick={() => trackingData.awb_code && fetchTrackingByAwb(trackingData.awb_code)}>
                Refresh
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Waybill Number</p>
                  <p className="text-sm text-muted-foreground">{trackingData.awb_code}</p>
                </div>
                <div>
                  {getStatusBadge(trackingData.status)}
                </div>
              </div>
              
              {trackingData.current_location && (
                <div>
                  <p className="font-medium">Current Location</p>
                  <p className="text-sm text-muted-foreground">{trackingData.current_location}</p>
                </div>
              )}
              
              {trackingData.scan_details && trackingData.scan_details.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Tracking History</h3>
                  <div className="space-y-3">
                    {trackingData.scan_details.map((scan, index) => (
                      <div key={index} className="flex gap-3 text-sm">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                          {index !== trackingData.scan_details!.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 flex-grow"></div>
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="font-medium">{scan.status}</p>
                          <p className="text-muted-foreground">
                            {new Date(scan.scan_datetime).toLocaleString()} • {scan.location}
                          </p>
                          {scan.remarks && (
                            <p className="text-muted-foreground mt-1">{scan.remarks}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {trackingLoading && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipment Tracking</h2>
            <p>Loading tracking information...</p>
          </div>
        )}

        {trackingError && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipment Tracking</h2>
            <p className="text-destructive mb-4">{trackingError}</p>
            <Button variant="outline" onClick={() => {
              // Try to refetch tracking data
              if (order.id) {
                // Get AWB code and fetch tracking data
                fetch(`/api/orders/${order.id}/tracking`).then(res => res.json()).then(data => {
                  if (data.awb_code) {
                    fetchTrackingByAwb(data.awb_code);
                  }
                }).catch(err => {
                  setTrackingError(err instanceof Error ? err.message : "Failed to load tracking information");
                });
              }
            }}>
              Retry
            </Button>
          </div>
        )}

        {/* Only show shipping address if it exists */}
        {address && Object.keys(address).length > 0 && (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="text-sm space-y-1">
              <p>{address.address_line1 || ''}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>
                {address.city || ''}, {address.state || ''} {address.postal_code || ''}
              </p>
              <p>{address.country || ''}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}