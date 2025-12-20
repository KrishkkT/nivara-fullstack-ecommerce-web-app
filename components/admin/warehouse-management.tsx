"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { sql } from "@/lib/db";

interface PickupLocation {
  id: number;
  name: string;
  shiprocket_location_id: number;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
  phone: string;
  email: string;
  primary: boolean;
}

export function WarehouseManagement() {
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    warehouse_name: "",
    warehouse_code: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    phone: "",
    email: "",
    is_active: true
  });

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/warehouses");
      const data = await response.json();
      
      if (response.ok) {
        setPickupLocations(data.warehouses || []);
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
    fetchWarehouses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/warehouses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create warehouse");
      }

      setSuccess("Pickup location created successfully!");
      setFormData({
        warehouse_name: "",
        warehouse_code: "", // Not used in Shiprocket but kept for compatibility
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        phone: "",
        email: "",
        is_active: true // Maps to 'primary' in Shiprocket
      });
      
      // Refresh the warehouse list
      fetchWarehouses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Pickup Location</CardTitle>
          <CardDescription>Add a new pickup location for Shiprocket shipping operations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse_name">Location Name *</Label>
                <Input
                  id="warehouse_name"
                  value={formData.warehouse_name}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warehouse_code">Location Code</Label>
                <Input
                  id="warehouse_code"
                  value={formData.warehouse_code}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address_line1">Address Line 1 *</Label>
                <Input
                  id="address_line1"
                  value={formData.address_line1}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input
                  id="address_line2"
                  value={formData.address_line2}
                  onChange={handleInputChange}
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code *</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={submitting}
                />
              </div>
              
              <div className="space-y-2 flex items-center">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleSwitchChange}
                  disabled={submitting}
                />
                <Label htmlFor="is_active" className="ml-2">Active</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" disabled={submitting}>
                Reset
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Warehouse"
                )}
              </Button>
            </div>
          </form>
          
          {(error || success) && (
            <div className="mt-4">
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Existing Pickup Locations</CardTitle>
          <CardDescription>Manage your Shiprocket pickup locations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : pickupLocations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No pickup locations found</p>
          ) : (
            <div className="space-y-4">
              {pickupLocations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {location.shiprocket_location_id}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        warehouse.is_active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {warehouse.is_active ? "Active" : "Inactive"}
                      </span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <p>{location.address}</p>
                    <p>{location.city}, {location.state} {location.pin_code}</p>
                    <p>{location.country}</p>
                    {location.phone && <p>Phone: {location.phone}</p>}
                    {location.email && <p>Email: {location.email}</p>}
                    <p className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        location.primary 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {location.primary ? "Primary Location" : "Secondary Location"}
                      </span>
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