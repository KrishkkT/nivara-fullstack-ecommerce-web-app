"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export function ShippingCostEstimator() {
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [weight, setWeight] = useState("");
  const [cod, setCod] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fixed warehouse pincode (should be configurable)
  const WAREHOUSE_PINCODE = process.env.NEXT_PUBLIC_WAREHOUSE_PINCODE || "110001";

  const estimateCost = async () => {
    if (!deliveryPincode || !weight) {
      setError("Please enter both delivery pincode and weight");
      return;
    }

    if (deliveryPincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError("Please enter a valid weight");
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
          action: "calculate-cost",
          pickup_pincode: WAREHOUSE_PINCODE,
          delivery_pincode: deliveryPincode,
          weight: weightValue,
          cod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate shipping cost");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Shipping Cost Estimator</CardTitle>
        <CardDescription>Estimate shipping costs before checkout</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delivery-pincode">Delivery Pincode</Label>
            <Input
              id="delivery-pincode"
              type="text"
              placeholder="Enter 6-digit pincode"
              value={deliveryPincode}
              onChange={(e) => setDeliveryPincode(e.target.value)}
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Package Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter weight in kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="0.1"
              step="0.1"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cod"
              checked={cod}
              onCheckedChange={(checked) => setCod(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="cod">Cash on Delivery (COD)</Label>
          </div>

          <Button 
            onClick={estimateCost} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate Shipping Cost"
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Estimated Shipping Cost</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Base Charge:</span>
                <span className="text-right">₹{result.base_charges?.toFixed(2) || "0.00"}</span>
                
                <span>Weight Charge:</span>
                <span className="text-right">₹{result.weight_charges?.toFixed(2) || "0.00"}</span>
                
                <span>COD Charge:</span>
                <span className="text-right">₹{result.cod_charges?.toFixed(2) || "0.00"}</span>
                
                <span className="font-semibold border-t pt-2 mt-2">Total:</span>
                <span className="font-semibold text-right border-t pt-2 mt-2">
                  ₹{result.total_charges?.toFixed(2) || "0.00"}
                </span>
              </div>
              
              {result.estimated_delivery_days && (
                <p className="text-sm text-muted-foreground mt-2">
                  Estimated delivery: {result.estimated_delivery_days} days
                </p>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Note: This is an estimate. Actual charges may vary.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}