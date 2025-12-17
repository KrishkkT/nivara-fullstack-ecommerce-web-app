"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Order {
  id: number;
  order_number: string;
  total_amount: string;
  status: string;
  payment_status: string;
  payment_type: string | null;
  created_at: string;
  customer_name: string;
  customer_email: string;
  shipping_address: any;
}

interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  product_price: string;
  quantity: number;
  image_url: string | null;
  product_slug: string | null;
}

interface Shipment {
  waybill_number: string;
  status: string;
  event_data: any;
  created_at: string;
  updated_at: string;
}

export function AdminOrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch order details");
        }

        setOrder(data.order);
        setItems(data.items);
        setShipment(data.shipment);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const fetchTrackingData = async () => {
    if (!shipment?.waybill_number) return;

    try {
      setTrackingLoading(true);
      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "track-shipment",
          waybill: shipment.waybill_number,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to track shipment");
      }

      setTrackingData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tracking data");
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "shipped":
        return <Badge variant="default">Shipped</Badge>;
      case "delivered":
        return <Badge variant="default">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getShipmentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
        return <Badge variant="secondary">Created</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-500">In Transit</Badge>;
      case "out_for_delivery":
        return <Badge className="bg-yellow-500">Out for Delivery</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "rto":
        return <Badge variant="destructive">Returned</Badge>;
      case "ndr":
        return <Badge variant="outline">Action Required</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No order found with the provided ID.</p>
        </CardContent>
      </Card>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Order #{order.order_number}</CardTitle>
              <CardDescription>Placed on {orderDate}</CardDescription>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(order.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Customer</h3>
              <p className="text-sm">{order.customer_name}</p>
              <p className="text-sm text-muted-foreground">{order.customer_email}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Payment</h3>
              <p className="text-sm capitalize">{order.payment_type || "N/A"}</p>
              <p className="text-sm">{order.payment_status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {item.image_url && (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  {item.product_slug ? (
                    <Link href={`/products/${item.product_slug}`} className="font-medium hover:text-primary transition-colors">
                      {item.product_name}
                    </Link>
                  ) : (
                    <p className="font-medium">{item.product_name}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(Number.parseFloat(item.product_price))}</p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(Number.parseFloat(item.product_price) * item.quantity)} total
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-right">
            <p className="text-lg font-semibold">Total: {formatPrice(Number.parseFloat(order.total_amount))}</p>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      {order.shipping_address && (
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p>{order.shipping_address.address_line1 || ""}</p>
              {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
              <p>
                {order.shipping_address.city || ""}, {order.shipping_address.state || ""} {order.shipping_address.postal_code || ""}
              </p>
              <p>{order.shipping_address.country || ""}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipment Details */}
      {shipment && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Shipment Details</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchTrackingData}
                disabled={trackingLoading}
              >
                {trackingLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Tracking
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Waybill Number</p>
                  <p className="font-medium">{shipment.waybill_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div>{getShipmentStatusBadge(shipment.status)}</div>
                </div>
              </div>
              
              {trackingData && trackingData.ShipmentData && trackingData.ShipmentData.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Tracking Timeline</h3>
                  <div className="space-y-3">
                    {trackingData.ShipmentData[0].ScanDetail?.Scans?.map((scan: any, index: number) => (
                      <div key={index} className="flex gap-3 text-sm">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                          {index !== trackingData.ShipmentData[0].ScanDetail.Scans.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 flex-grow"></div>
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="font-medium">{scan.ScanType}</p>
                          <p className="text-muted-foreground">
                            {new Date(scan.ScanDateTime).toLocaleString()} • {scan.ScannedLocation}
                          </p>
                          {scan.Remarks && (
                            <p className="text-muted-foreground mt-1">{scan.Remarks}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}