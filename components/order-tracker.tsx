"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function OrderTracker() {
  const [trackingId, setTrackingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const trackOrder = async () => {
    if (!trackingId) {
      setError("Please enter an AWB number or order ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/shiprocket/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingId: trackingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to track shipment");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    // Normalize Shiprocket statuses
    const normalizedStatus = status.toLowerCase().replace(/_/g, ' ');
    
    switch (normalizedStatus) {
      case "placed":
      case "confirmed":
      case "created":
        return <Badge variant="secondary">Created</Badge>;
      case "assigned":
      case "picked up":
      case "in transit":
        return <Badge className="bg-blue-500">In Transit</Badge>;
      case "out for delivery":
        return <Badge className="bg-yellow-500">Out for Delivery</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "rto initiated":
      case "rto delivered":
        return <Badge variant="destructive">Returned</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Track Your Order</CardTitle>
        <CardDescription>Enter your waybill number or order ID to track your shipment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="tracking-id">AWB Number or Order ID</Label>
              <Input
                id="tracking-id"
                type="text"
                placeholder="Enter AWB number or order ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={trackOrder} 
              disabled={isLoading}
              className="self-end"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                "Track"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && result.tracking_data && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Shipment Details</h3>
                    <p className="text-sm text-muted-foreground">
                      AWB: {result.tracking_data.awb}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(result.tracking_data.current_status.status)}
                  </div>
                </div>
                
                {result.tracking_data.current_location && (
                  <p className="text-sm mt-2">
                    Current Location: {result.tracking_data.current_location}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tracking Timeline</h4>
                <div className="space-y-4">
                  {result.tracking_data.shipment_track_activities?.map((activity: any, index: number) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        {index !== result.tracking_data.shipment_track_activities.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium">{activity.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.date} • {activity.location}
                        </p>
                        {activity.remarks && (
                          <p className="text-sm mt-1">{activity.remarks}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result && !result.tracking_data && (
            <Alert>
              <AlertDescription>No shipment found with the provided tracking ID.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}