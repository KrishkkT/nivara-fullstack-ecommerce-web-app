"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface Order {
  id: number
  order_number: string
  user_email: string
  total_amount: string
  status: string
  payment_status: string
  payment_type: string
  created_at: string
}

export function AdminOrdersList({ orders }: { orders: Order[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.payment_type === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-card border rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="min-w-[140px]">
              <label className="text-sm text-muted-foreground mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[140px]">
              <label className="text-sm text-muted-foreground mb-1 block">Payment</label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="razorpay">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="font-semibold text-foreground">Order</TableHead>
              <TableHead className="font-semibold text-foreground">Customer</TableHead>
              <TableHead className="font-semibold text-foreground">Date</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Payment</TableHead>
              <TableHead className="text-right font-semibold text-foreground">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-muted rounded-full p-3 mb-3">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium">No orders found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const paymentMethod = order.payment_type === "razorpay" ? "Online Payment" : order.payment_type || "Unknown"
                
                return (
                  <TableRow 
                    key={order.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => window.location.href = `/admin/orders/${order.id}`}
                  >
                    <TableCell className="font-medium">
                      <div className="font-mono text-sm">{order.order_number}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.user_email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(Number.parseFloat(order.total_amount))}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}