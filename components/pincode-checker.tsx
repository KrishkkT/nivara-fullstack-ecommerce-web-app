"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export function PincodeChecker() {
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ serviceable: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fixed warehouse pincode (should be configurable)
  const WAREHOUSE_PINCODE = process.env.NEXT_PUBLIC_WAREHOUSE_PINCODE || "110001";

  const checkAvailability = async () => {
    if (!deliveryPincode) {
      setError("Please enter a delivery pincode");
      return;
    }

    if (deliveryPincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
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
          action: "check-pincode",
          pickupPostcode: WAREHOUSE_PINCODE,
          deliveryPostcode: deliveryPincode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to check pincode serviceability");
      }

      setResult({
        serviceable: data.serviceable,
        message: data.serviceable 
          ? "Delivery is available to this pincode!" 
          : "Sorry, delivery is not available to this pincode."
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Check Delivery Availability</CardTitle>
        <CardDescription>Enter your pincode to check if we deliver to your area</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter 6-digit pincode"
              value={deliveryPincode}
              onChange={(e) => setDeliveryPincode(e.target.value)}
              maxLength={6}
              disabled={isLoading}
            />
            <Button 
              onClick={checkAvailability} 
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Check"}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert variant={result.serviceable ? "default" : "destructive"}>
              {result.serviceable ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <p className="text-sm text-muted-foreground">
            Note: Our warehouse is located in pincode {WAREHOUSE_PINCODE}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}