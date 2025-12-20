"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  RefreshCw,
  MapPin,
  Tag,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface ShiprocketOrder {
  id: number;
  order_id: string;
  shiprocket_order_id: number;
  shipment_id: number | null;
  awb_code: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  local_order_number: string;
  customer_name: string;
  total_amount: number;
  // Add tracking information
  tracking_url?: string;
  // Add shipment details
  shipment_status?: string;
  estimated_delivery_date?: string;
}

export function LogisticsDashboard() {
  const [orders, setOrders] = useState<ShiprocketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/shiprocket/orders/list");
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
        
        // Calculate stats
        const ordersList = data.orders || [];
        const totalOrders = ordersList.length;
        const pendingOrders = ordersList.filter((o: any) => 
          !o.status.toLowerCase().includes('shipped') && 
          !o.status.toLowerCase().includes('delivered') &&
          !o.status.toLowerCase().includes('cancel')
        ).length;
        const shippedOrders = ordersList.filter((o: any) => 
          o.status.toLowerCase().includes('shipped') ||
          o.status.toLowerCase().includes('picked')
        ).length;
        const deliveredOrders = ordersList.filter((o: any) => 
          o.status.toLowerCase().includes('delivered')
        ).length;
        
        setStats({
          totalOrders,
          pendingOrders,
          shippedOrders,
          deliveredOrders
        });
      } else {
        throw new Error(data.error || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes("delivered")) {
      return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" /> Delivered</Badge>;
    } else if (statusLower.includes("shipped") || statusLower.includes("picked")) {
      return <Badge variant="secondary"><Truck className="w-3 h-3 mr-1" /> Shipped</Badge>;
    } else if (statusLower.includes("cancel") || statusLower.includes("return")) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
    } else {
      return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Processing</Badge>;
    }
  };

  const refreshOrders = async () => {
    // In a real implementation, this would fetch fresh data from Shiprocket
    await fetchOrders();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logistics Dashboard</CardTitle>
          <CardDescription>Manage your shipping orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logistics Dashboard</CardTitle>
          <CardDescription>Manage your shipping orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchOrders} className="mt-4">Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Logistics Dashboard</CardTitle>
            <CardDescription>Manage your shipping orders</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshOrders}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-green-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Shipped</p>
                  <p className="text-2xl font-bold">{stats.shippedOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Delivered</p>
                  <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400 mt-1">Orders will appear here once they are created</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{order.local_order_number}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Customer: {order.customer_name} • ₹{order.total_amount.toFixed(2)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    {order.shiprocket_order_id && (
                      <span className="text-xs text-gray-400 flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        SR: {order.shiprocket_order_id}
                      </span>
                    )}
                    {order.awb_code && (
                      <span className="text-xs text-blue-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        AWB: {order.awb_code}
                      </span>
                    )}
                  </div>
                  {order.shipment_status && (
                    <p className="text-xs mt-1">
                      Shipment: <span className="font-medium">{order.shipment_status}</span>
                      {order.estimated_delivery_date && (
                        <> • Est. Delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}</>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  {order.awb_code && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://app.shiprocket.in/shipment/tracking/${order.awb_code}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Track
                      </a>
                    </Button>
                  )}
                  {order.shiprocket_order_id && (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://app.shiprocket.in/orders/${order.shiprocket_order_id}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Shiprocket
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}