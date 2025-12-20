"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { sql } from "@/lib/db";

interface ShiprocketOrder {
  id: number;
  order_id: number;
  shiprocket_order_id: number;
  shipment_id: number | null;
  awb_code: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function WaybillPrefetch() {
  const [count, setCount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [prefetching, setPrefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [shiprocketOrders, setShiprocketOrders] = useState<ShiprocketOrder[]>([]);
  
  const fetchShiprocketOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/shiprocket-orders");
      const data = await response.json();
      
      if (response.ok) {
        setShiprocketOrders(data.orders || []);
      } else {
        throw new Error(data.error || "Failed to fetch Shiprocket orders");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch Shiprocket orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShiprocketOrders();
  }, []);

  const handlePrefetch = async () => {
    if (count <= 0 || count > 1000) {
      setError("Please enter a valid count between 1 and 1000");
      return;
    }

    setPrefetching(true);
    setError(null);
    setSuccess(null);

    try {
      // For Shiprocket, we don't prefetch waybills. Instead, we create orders directly.
      // This component is repurposed to show recent Shiprocket orders.
      setSuccess("This section now shows recent Shiprocket orders.");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to prefetch waybills");
      }

      setSuccess("Displaying recent Shiprocket orders.");
      
      // Refresh the Shiprocket orders list
      fetchShiprocketOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setPrefetching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    // Shiprocket order statuses
    switch (status) {
      case "placed":
        return <Badge className="bg-blue-500">Placed</Badge>;
      case "confirmed":
        return <Badge className="bg-indigo-500">Confirmed</Badge>;
      case "picked":
        return <Badge className="bg-purple-500">Picked</Badge>;
      case "packed":
        return <Badge className="bg-yellow-500">Packed</Badge>;
      case "shipped":
        return <Badge className="bg-orange-500">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "returned":
        return <Badge className="bg-red-500">Returned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Stats for Shiprocket orders
  const placedCount = shiprocketOrders.filter(o => o.status === "placed").length;
  const shippedCount = shiprocketOrders.filter(o => o.status === "shipped").length;
  const deliveredCount = shiprocketOrders.filter(o => o.status === "delivered").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Shiprocket Orders</CardTitle>
          <CardDescription>View recent orders processed through Shiprocket</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-muted-foreground">
                  This section now displays recent Shiprocket orders instead of prefetching waybills.
                </p>
              </div>
              <div className="self-end">
                <Button 
                  onClick={handlePrefetch} 
                  disabled={prefetching}
                  className="h-10"
                >
                  {prefetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    "Refresh Orders"
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">Placed</h3>
                <p className="text-2xl font-bold text-blue-600">{placedCount}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">Shipped</h3>
                <p className="text-2xl font-bold text-orange-600">{shippedCount}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">Delivered</h3>
                <p className="text-2xl font-bold text-green-600">{deliveredCount}</p>
              </div>
            </div>
            
            {(error || success) && (
              <div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            <div>
              <h3 className="font-semibold mb-2">Recent Shiprocket Orders</h3>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : shiprocketOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No Shiprocket orders found</p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">Order ID</th>
                        <th className="text-left p-3">AWB Code</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Created At</th>
                        <th className="text-left p-3">Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiprocketOrders.slice(0, 10).map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-3 font-mono text-sm">{order.shiprocket_order_id}</td>
                          <td className="p-3 font-mono text-sm">{order.awb_code || 'N/A'}</td>
                          <td className="p-3">{getStatusBadge(order.status)}</td>
                          <td className="p-3 text-sm">
                            {new Date(order.created_at).toLocaleString()}
                          </td>
                          <td className="p-3 text-sm">
                            {new Date(order.updated_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}