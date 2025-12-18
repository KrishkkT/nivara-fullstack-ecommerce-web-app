"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";

interface PickupLocation {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  primary: boolean;
}

export function PickupLocationManagement() {
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPickupLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/shiprocket/pickup-locations");
      const data = await response.json();
      
      if (response.ok) {
        setPickupLocations(data.pickup_locations || []);
      } else {
        throw new Error(data.error || "Failed to fetch pickup locations");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pickup locations");
    } finally {
      setLoading(false);
    }
  };

  const refreshPickupLocations = async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/shiprocket/pickup-locations/refresh", { method: "POST" });
      const data = await response.json();
      
      if (response.ok) {
        setPickupLocations(data.pickup_locations || []);
        // Show success message
      } else {
        throw new Error(data.error || "Failed to refresh pickup locations");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh pickup locations");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPickupLocations();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pickup Locations</CardTitle>
              <CardDescription>Manage your pickup locations for shipments</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshPickupLocations}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : pickupLocations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No pickup locations found</p>
          ) : (
            <div className="space-y-4">
              {pickupLocations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{location.name}</h3>
                      {location.primary && (
                        <Badge className="mt-1">Primary</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                    <p>
                      <span className="font-medium">Address:</span> {location.address}, {location.city}, {location.state} - {location.pin_code}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span> {location.phone} / {location.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}