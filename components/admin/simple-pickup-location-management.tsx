// Simple Pickup Location Management Component
// This component displays pickup locations and allows basic management

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  RefreshCw, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface PickupLocation {
  id: number;
  pickup_location: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  phone: string;
  email: string;
  is_primary_location: boolean;
  status: number;
}

export function SimplePickupLocationManagement() {
  const [locations, setLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPickupLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/shiprocket/pickup-locations");
      const data = await response.json();
      
      if (response.ok) {
        // Handle different response structures
        let locationsData: PickupLocation[] = [];
        
        if (data.data && Array.isArray(data.data.shipping_address)) {
          locationsData = data.data.shipping_address;
        } else if (data.data && Array.isArray(data.data.pickup_locations)) {
          locationsData = data.data.pickup_locations;
        } else if (data.data && Array.isArray(data.data.data)) {
          locationsData = data.data.data;
        } else if (data.data && Array.isArray(data.data.pickup_location)) {
          locationsData = data.data.pickup_location;
        } else if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
          locationsData = [data.data];
        } else if (Array.isArray(data.data)) {
          locationsData = data.data;
        }
        
        setLocations(locationsData);
      } else {
        throw new Error(data.error || "Failed to fetch pickup locations");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pickup locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupLocations();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pickup Locations</CardTitle>
          <CardDescription>Manage your pickup locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
          <CardTitle>Pickup Locations</CardTitle>
          <CardDescription>Manage your pickup locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchPickupLocations} className="mt-4">Retry</Button>
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
            <CardTitle>Pickup Locations</CardTitle>
            <CardDescription>Manage your pickup locations</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchPickupLocations}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No pickup locations found</p>
            <p className="text-sm text-gray-400 mt-1">Add pickup locations in your Shiprocket account</p>
          </div>
        ) : (
          <div className="space-y-4">
            {locations.map((location) => (
              <div key={location.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{location.pickup_location}</h3>
                    {location.is_primary_location ? (
                      <Badge variant="default">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Primary
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {location.address}, {location.city}, {location.state} - {location.pin_code}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Phone: {location.phone} • Email: {location.email}
                  </p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={`https://app.shiprocket.in/settings/pickup-locations/${location.id}`} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Edit in Shiprocket
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}