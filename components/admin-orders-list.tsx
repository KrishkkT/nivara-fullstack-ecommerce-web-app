"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Order {
  id: number
  order_number: string
  total_amount: string
  status: string
  payment_status: string
  payment_type: string
  created_at: string
  customer_name: string
  customer_email: string
  item_count: number
  razorpay_order_id?: string
}

interface AdminOrdersListProps {
  orders: Order[]
}

export function AdminOrdersList({ orders }: AdminOrdersListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/admin/orders")
      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to refresh orders:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(amount))
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-4 cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Orders</h1>
              <p className="text-muted-foreground">Manage customer orders</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="cursor-pointer bg-transparent"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by order number, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Order Number</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      {searchQuery ? "No orders found matching your search" : "No orders yet"}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const paymentMethod = order.payment_type === "razorpay" ? "Razorpay" : "COD"
                    const isCancelled = order.status === "cancelled"

                    return (
                      <tr key={order.id} className="border-b last:border-0">
                        <td className="py-4">
                          <p className="font-medium">{order.order_number}</p>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                        </td>
                        <td className="py-4">{order.item_count} items</td>
                        <td className="py-4 font-semibold">{formatCurrency(order.total_amount)}</td>
                        <td className="py-4 capitalize">
                          <div className="space-y-1">
                            <span className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                              {paymentMethod}
                            </span>
                            {!isCancelled && order.payment_status !== "paid" && (
                              <span className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 ml-1">
                                {order.payment_status === "awaiting_payment" ? "Pending" : order.payment_status}
                              </span>
                            )}
                            {order.payment_status === "paid" && (
                              <span className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800 ml-1">
                                Paid
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "shipped"
                                      ? "bg-purple-100 text-purple-800"
                                      : order.status === "delivered"
                                        ? "bg-green-100 text-green-800"
                                        : order.status === "cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm">{formatDate(order.created_at)}</td>
                        <td className="py-4">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm" className="cursor-pointer bg-transparent">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
