"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function ShiprocketPickupManagement() {
  const [shipmentIds, setShipmentIds] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequestPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse shipment IDs
      const ids = shipmentIds
        .split(",")
        .map(id => id.trim())
        .filter(id => id.length > 0)
        .map(id => parseInt(id))
        .filter(id => !isNaN(id));

      if (ids.length === 0) {
        throw new Error("Please enter at least one valid shipment ID");
      }

      // Request pickup from Shiprocket
      const response = await fetch("/api/shiprocket/pickups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shipmentIds: ids,
          pickupDate: pickupDate || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to request pickup");
      }

      setSuccess(`Pickup requested successfully! Token: ${data.pickup_token}`);
      
      // Reset form
      setShipmentIds("");
      setPickupDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Pickup</CardTitle>
        <CardDescription>Request pickup for shipments from Shiprocket</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRequestPickup} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shipment-ids">Shipment IDs *</Label>
              <Input
                id="shipment-ids"
                placeholder="Enter shipment IDs separated by commas (e.g., 12345, 67890)"
                value={shipmentIds}
                onChange={(e) => setShipmentIds(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Enter one or more shipment IDs separated by commas
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pickup-date">Pickup Date (Optional)</Label>
              <Input
                id="pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Leave blank for immediate pickup request
              </p>
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
          
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Requesting Pickup...
                </>
              ) : (
                "Request Pickup"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}