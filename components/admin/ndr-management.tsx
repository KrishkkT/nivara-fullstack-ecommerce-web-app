"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, RotateCcw, Undo } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NdrShipment {
  id: number;
  awb_code: string;
  order_id: number;
  status: string;
  remarks: string;
  created_at: string;
}

export function NdrManagement() {
  const [ndrShipments, setNdrShipments] = useState<NdrShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchNdrShipments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/ndr-shipments");
      const data = await response.json();
      
      if (response.ok) {
        setNdrShipments(data.shipments || []);
      } else {
        throw new Error(data.error || "Failed to fetch NDR shipments");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch NDR shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNdrShipments();
  }, []);

  const handleNdrAction = async (awb_code: string, action: string, remarks?: string) => {
    setActionLoading(`${action}-${awb_code}`);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "handle-ndr",
          awb_code: awb_code,
          action: action,
          remarks: remarks
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process NDR action");
      }

      setSuccess(`NDR action "${action}" processed successfully!`);
      
      // Refresh the NDR shipment list
      fetchNdrShipments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NDR Management</CardTitle>
          <CardDescription>Manage shipments with Not Delivered Response (NDR)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
            ) : ndrShipments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No NDR shipments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ndrShipments.map((shipment) => (
                  <div key={shipment.id} className="border rounded-lg p-4">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">AWB: {shipment.awb_code}</h3>
                          <Badge variant="outline">NDR</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Order ID: #{shipment.order_id}</p>
                        <p className="text-sm mt-1">Remarks: {shipment.remarks}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(shipment.created_at).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleNdrAction(shipment.awb_code, "reattempt")}
                          disabled={actionLoading === `reattempt-${shipment.awb_code}`}
                        >
                          {actionLoading === `reattempt-${shipment.awb_code}` ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <RotateCcw className="h-4 w-4 mr-2" />
                          )}
                          Reattempt
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleNdrAction(shipment.awb_code, "rto")}
                          disabled={actionLoading === `rto-${shipment.awb_code}`}
                        >
                          {actionLoading === `rto-${shipment.awb_code}` ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Undo className="h-4 w-4 mr-2" />
                          )}
                          RTO
                        </Button>
                        
                        <Select 
                          onValueChange={(value) => 
                            handleNdrAction(shipment.awb_code, "custom", value)
                          }
                          disabled={actionLoading !== null}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Custom Action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer_not_available">Customer Not Available</SelectItem>
                            <SelectItem value="address_not_found">Address Not Found</SelectItem>
                            <SelectItem value="customer_refused">Customer Refused</SelectItem>
                            <SelectItem value="wrong_contact">Wrong Contact Info</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}