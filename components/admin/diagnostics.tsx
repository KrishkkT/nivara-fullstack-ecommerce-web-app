"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";

interface DiagnosticsData {
  waybillStats: {
    total: number;
    available: number;
    used: number;
    expired: number;
  };
  recentWaybills: {
    waybill_number: string;
    status: string;
    created_at: string;
    used_at: string | null;
  }[];
  shipmentStats: {
    total: number;
    created: number;
    in_transit: number;
    out_for_delivery: number;
    delivered: number;
    cancelled: number;
    rto: number;
    ndr: number;
  };
  recentShipments: {
    waybill_number: string;
    order_id: number | null;
    status: string;
    created_at: string;
    updated_at: string;
    event_data: any;
  }[];
  warehouses: {
    warehouse_name: string;
    warehouse_code: string;
    city: string;
    state: string;
    is_active: boolean;
    created_at: string;
  }[];
}

export function Diagnostics() {
  const [data, setData] = useState<DiagnosticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/admin/diagnostics");
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch diagnostics");
      }
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load diagnostics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return <Badge variant="secondary">Available</Badge>;
      case "used":
        return <Badge className="bg-green-500">Used</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
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

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No diagnostics data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Diagnostics</h1>
          <p className="text-muted-foreground">Monitor Delhivery integration status</p>
        </div>
        <Button onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Waybill Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Waybill Statistics</CardTitle>
          <CardDescription>Overview of waybill usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{data.waybillStats.total}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-green-600">{data.waybillStats.available}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Used</p>
              <p className="text-2xl font-bold">{data.waybillStats.used}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold text-destructive">{data.waybillStats.expired}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipment Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Statistics</CardTitle>
          <CardDescription>Overview of shipment statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{data.shipmentStats.total}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-2xl font-bold">{data.shipmentStats.created}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">{data.shipmentStats.in_transit}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Out for Delivery</p>
              <p className="text-2xl font-bold text-yellow-600">{data.shipmentStats.out_for_delivery}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{data.shipmentStats.delivered}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold text-destructive">{data.shipmentStats.cancelled}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">RTO</p>
              <p className="text-2xl font-bold text-destructive">{data.shipmentStats.rto}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">NDR</p>
              <p className="text-2xl font-bold">{data.shipmentStats.ndr}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Waybills */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Waybills</CardTitle>
          <CardDescription>Last 10 waybills created</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Waybill</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Created</th>
                  <th className="text-left py-2">Used</th>
                </tr>
              </thead>
              <tbody>
                {data.recentWaybills.map((waybill, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-mono text-sm">{waybill.waybill_number}</td>
                    <td className="py-2">{getStatusBadge(waybill.status)}</td>
                    <td className="py-2 text-sm">
                      {new Date(waybill.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-sm">
                      {waybill.used_at 
                        ? new Date(waybill.used_at).toLocaleDateString()
                        : "Not used"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>Last 10 shipments created</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Waybill</th>
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Created</th>
                  <th className="text-left py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.recentShipments.map((shipment, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-mono text-sm">{shipment.waybill_number}</td>
                    <td className="py-2">#{shipment.order_id || "N/A"}</td>
                    <td className="py-2">{getStatusBadge(shipment.status)}</td>
                    <td className="py-2 text-sm">
                      {new Date(shipment.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2 text-sm">
                      {new Date(shipment.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Warehouses */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouses</CardTitle>
          <CardDescription>Configured warehouse information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Code</th>
                  <th className="text-left py-2">Location</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.warehouses.map((warehouse, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{warehouse.warehouse_name}</td>
                    <td className="py-2 font-mono text-sm">{warehouse.warehouse_code}</td>
                    <td className="py-2 text-sm">
                      {warehouse.city}, {warehouse.state}
                    </td>
                    <td className="py-2">
                      {warehouse.is_active ? (
                        <Badge variant="secondary">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}