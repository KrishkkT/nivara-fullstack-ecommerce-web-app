"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, X } from "lucide-react";

interface Shipment {
  id: number;
  shiprocket_order_id: number;
  order_id: number;
  shipment_id: number | null;
  awb_code: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function ShiprocketShipmentManagement() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/shiprocket-shipments");
      const data = await response.json();
      
      if (response.ok) {
        setShipments(data.shipments || []);
      } else {
        throw new Error(data.error || "Failed to fetch shipments");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

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

  const handleGenerateLabel = async (shipmentId: number) => {
    setActionLoading(`label-${shipmentId}`);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/shiprocket/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shipmentId: shipmentId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate shipping label");
      }

      // Open the label URL in a new tab
      if (data.label_url) {
        window.open(data.label_url, '_blank');
        setSuccess("Shipping label opened in new tab!");
      } else {
        throw new Error("Label URL not found in response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredShipments = shipments.filter(shipment => 
    (shipment.awb_code && shipment.awb_code.includes(searchTerm)) || 
    shipment.order_id.toString().includes(searchTerm) ||
    shipment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipment Management</CardTitle>
          <CardDescription>Manage and track all Shiprocket shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search">Search Shipments</Label>
                <Input
                  id="search"
                  placeholder="Search by AWB, order ID, or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No shipments found</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3">AWB Code</th>
                      <th className="text-left p-3">Order ID</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Created</th>
                      <th className="text-left p-3">Updated</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShipments.map((shipment) => (
                      <tr key={shipment.id} className="border-b">
                        <td className="p-3 font-mono text-sm">{shipment.awb_code || 'N/A'}</td>
                        <td className="p-3">#{shipment.order_id}</td>
                        <td className="p-3">{getStatusBadge(shipment.status)}</td>
                        <td className="p-3 text-sm">
                          {new Date(shipment.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-sm">
                          {new Date(shipment.updated_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            {shipment.shipment_id && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGenerateLabel(shipment.shipment_id!)}
                                disabled={actionLoading === `label-${shipment.shipment_id}`}
                              >
                                {actionLoading === `label-${shipment.shipment_id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                                <span className="sr-only">Download Label</span>
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}