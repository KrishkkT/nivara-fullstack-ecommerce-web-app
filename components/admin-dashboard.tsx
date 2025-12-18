"use client"

import { Package, ShoppingCart, Users, DollarSign, FolderTree, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChangePasswordForm } from "@/components/change-password-form"

interface Stats {
  total_orders: number
  pending_orders: number
  paid_orders: number
  total_users: number
  total_products: number
  total_revenue: string
}

interface Order {
  id: number
  order_number: string
  total_amount: string
  status: string
  created_at: string
  customer_name: string
  customer_email: string
}

interface Product {
  id: number
  name: string
  image_url: string
  price: string
  order_count: number
}

interface AdminDashboardProps {
  stats: Stats
  recentOrders: Order[]
  topProducts: Product[]
}

export function AdminDashboard({ stats, recentOrders, topProducts }: AdminDashboardProps) {
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
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your NIVARA store</p>
        </div>

        <div className="mb-8 flex gap-4 flex-wrap">
          <Link href="/admin/orders">
            <Button variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="outline">
              <FolderTree className="h-4 w-4 mr-2" />
              Categories
            </Button>
          </Link>
          <Link href="/admin/emails">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Notifications
            </Button>
          </Link>

        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total_orders}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-accent/10 p-3">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-secondary/10 p-3">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.total_users}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-2xl font-bold">{stats.total_products}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-center text-muted-foreground">No orders yet</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Top Products */}
          <div className="space-y-8">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Top Products</h2>
                <Link href="/admin/products">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                {topProducts.length === 0 ? (
                  <p className="text-center text-muted-foreground">No products yet</p>
                ) : (
                  topProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="flex items-center gap-1 text-sm font-semibold">
                          <TrendingUp className="h-4 w-4" />
                          {product.order_count} sales
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
            
            {/* Change Password Form */}
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}