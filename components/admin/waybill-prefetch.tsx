"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { sql } from "@/lib/db";

interface Waybill {
  id: number;
  waybill_number: string;
  status: string;
  created_at: string;
  used_at: string | null;
}

export function WaybillPrefetch() {
  const [count, setCount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [prefetching, setPrefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [waybills, setWaybills] = useState<Waybill[]>([]);
  
  const fetchWaybills = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/waybills");
      const data = await response.json();
      
      if (response.ok) {
        setWaybills(data.waybills || []);
      } else {
        throw new Error(data.error || "Failed to fetch waybills");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch waybills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaybills();
  }, []);

  const handlePrefetch = async () => {
    if (count <= 0 || count > 1000) {
      setError("Please enter a valid count between 1 and 1000");
      return;
    }

    setPrefetching(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "fetch-waybills",
          count: count
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to prefetch waybills");
      }

      setSuccess(`Successfully prefetched ${data.waybills?.length || 0} waybills!`);
      
      // Refresh the waybill list
      fetchWaybills();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setPrefetching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>;
      case "used":
        return <Badge className="bg-blue-500">Used</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const availableCount = waybills.filter(w => w.status === "available").length;
  const usedCount = waybills.filter(w => w.status === "used").length;
  const expiredCount = waybills.filter(w => w.status === "expired").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Waybill Prefetch</CardTitle>
          <CardDescription>Pre-fetch waybills for shipment creation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="count">Number of Waybills</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="1000"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                  disabled={prefetching}
                />
              </div>
              <div className="self-end">
                <Button 
                  onClick={handlePrefetch} 
                  disabled={prefetching}
                  className="h-10"
                >
                  {prefetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Prefetching...
                    </>
                  ) : (
                    "Prefetch Waybills"
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">Available</h3>
                <p className="text-2xl font-bold text-green-600">{availableCount}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">Used</h3>
                <p className="text-2xl font-bold text-blue-600">{usedCount}</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">Expired</h3>
                <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
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
            
            <div>
              <h3 className="font-semibold mb-2">Recent Activity</h3>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : waybills.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No waybills found</p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3">Waybill Number</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Created At</th>
                        <th className="text-left p-3">Used At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waybills.slice(0, 10).map((waybill) => (
                        <tr key={waybill.id} className="border-b">
                          <td className="p-3 font-mono text-sm">{waybill.waybill_number}</td>
                          <td className="p-3">{getStatusBadge(waybill.status)}</td>
                          <td className="p-3 text-sm">
                            {new Date(waybill.created_at).toLocaleString()}
                          </td>
                          <td className="p-3 text-sm">
                            {waybill.used_at 
                              ? new Date(waybill.used_at).toLocaleString()
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}