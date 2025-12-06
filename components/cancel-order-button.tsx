"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cancelOrder } from "@/app/actions/orders"
import { cancelOrder as adminCancelOrder } from "@/app/actions/admin"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface CancelOrderButtonProps {
  orderId: number
  isAdmin?: boolean
}

export function CancelOrderButton({ orderId, isAdmin = false }: CancelOrderButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return
    }

    setLoading(true)
    const result = isAdmin ? await adminCancelOrder(orderId) : await cancelOrder(orderId)
    setLoading(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully",
      })
      router.refresh()
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleCancel} disabled={loading} className="w-full">
      {loading ? "Cancelling..." : "Cancel Order"}
    </Button>
  )
}
