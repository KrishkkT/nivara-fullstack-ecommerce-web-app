"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateOrderStatus } from "@/app/actions/admin"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface UpdateOrderStatusProps {
  orderId: number
  currentStatus: string
}

export function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleStatusUpdate(newStatus: string) {
    setLoading(true)
    const result = await updateOrderStatus(orderId, newStatus)
    setLoading(false)

    if (result.success) {
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully.",
      })
      setStatus(newStatus)
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <div className="flex-1 min-w-[200px]">
        <Select value={status} onValueChange={handleStatusUpdate} disabled={loading}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                disabled={option.value === currentStatus}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {loading && (
        <span className="text-sm text-muted-foreground">Updating...</span>
      )}
    </div>
  )
}