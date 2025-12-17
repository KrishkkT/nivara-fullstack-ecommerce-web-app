"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Truck, X } from "lucide-react";

interface Shipment {
  id: number;
  waybill_number: string;
  order_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export function ShipmentManagement() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/shipments");
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
    switch (status.toLowerCase()) {
      case "created":
        return <Badge variant="secondary">Created</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-500">In Transit</Badge>;
      case "out_for_delivery":
        return <Badge className="bg-yellow-500">Out for Delivery</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "rto":
        return <Badge variant="destructive">Returned</Badge>;
      case "ndr":
        return <Badge variant="outline">Action Required</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleGenerateLabel = async (waybill: string) => {
    setActionLoading(`label-${waybill}`);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generate-label",
          waybill: waybill
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate shipping label");
      }

      // Convert response to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shipping-label-${waybill}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess("Shipping label downloaded successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelShipment = async (waybill: string) => {
    setActionLoading(`cancel-${waybill}`);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "cancel-shipment",
          waybill: waybill
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel shipment");
      }

      setSuccess("Shipment cancelled successfully!");
      
      // Refresh the shipment list
      fetchShipments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredShipments = shipments.filter(shipment => 
    shipment.waybill_number.includes(searchTerm) || 
    shipment.order_id.toString().includes(searchTerm) ||
    shipment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipment Management</CardTitle>
          <CardDescription>Manage and track all shipments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search">Search Shipments</Label>
                <Input
                  id="search"
                  placeholder="Search by waybill, order ID, or status..."
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
                      <th className="text-left p-3">Waybill</th>
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
                        <td className="p-3 font-mono text-sm">{shipment.waybill_number}</td>
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateLabel(shipment.waybill_number)}
                              disabled={actionLoading === `label-${shipment.waybill_number}`}
                            >
                              {actionLoading === `label-${shipment.waybill_number}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                              <span className="sr-only">Download Label</span>
                            </Button>
                            
                            {shipment.status !== "cancelled" && shipment.status !== "delivered" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelShipment(shipment.waybill_number)}
                                disabled={actionLoading === `cancel-${shipment.waybill_number}`}
                              >
                                {actionLoading === `cancel-${shipment.waybill_number}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                                <span className="sr-only">Cancel Shipment</span>
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