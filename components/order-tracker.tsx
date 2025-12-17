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
      setError("Please enter a waybill number or order ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "track-shipment",
          waybill: trackingId,
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
              <Label htmlFor="tracking-id">Waybill Number or Order ID</Label>
              <Input
                id="tracking-id"
                type="text"
                placeholder="Enter waybill number or order ID"
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

          {result && result.shipment_data && result.shipment_data.length > 0 && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Shipment Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Waybill: {result.shipment_data[0].waybill}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(result.shipment_data[0].status)}
                  </div>
                </div>
                
                {result.shipment_data[0].current_location && (
                  <p className="text-sm mt-2">
                    Current Location: {result.shipment_data[0].current_location}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tracking Timeline</h4>
                <div className="space-y-4">
                  {result.shipment_data[0].scan_details?.map((scan: any, index: number) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        {index !== result.shipment_data[0].scan_details.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-300"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium">{scan.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {scan.scan_datetime} • {scan.location}
                        </p>
                        {scan.remarks && (
                          <p className="text-sm mt-1">{scan.remarks}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result && result.shipment_data && result.shipment_data.length === 0 && (
            <Alert>
              <AlertDescription>No shipment found with the provided tracking ID.</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}