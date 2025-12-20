// Simple Shiprocket Shipment Creation Component
// This component allows manual creation of shipments for orders that are already in Shiprocket

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle
} from "lucide-react";

interface ShipmentCreationProps {
  orderId: number;
  orderNumber: string;
  shiprocketOrderId: number;
}

export function SimpleShipmentCreation({ orderId, orderNumber, shiprocketOrderId }: ShipmentCreationProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [formData, setFormData] = useState({
    courierId: "",
    weight: "0.5",
    length: "15",
    breadth: "10",
    height: "5"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createShipment = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await fetch("/api/shiprocket/shipments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shiprocket_order_id: shiprocketOrderId,
          courier_id: formData.courierId || undefined,
          weight: parseFloat(formData.weight),
          length: parseFloat(formData.length),
          breadth: parseFloat(formData.breadth),
          height: parseFloat(formData.height)
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: `Shipment created successfully! AWB: ${data.awb_code}`
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create shipment"
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to create shipment"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Shipment</CardTitle>
        <CardDescription>
          Create a shipment for order {orderNumber} (Shiprocket ID: {shiprocketOrderId})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="length">Length (cm)</Label>
              <Input
                id="length"
                name="length"
                type="number"
                step="1"
                min="1"
                value={formData.length}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="breadth">Breadth (cm)</Label>
              <Input
                id="breadth"
                name="breadth"
                type="number"
                step="1"
                min="1"
                value={formData.breadth}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="1"
                min="1"
                value={formData.height}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="courierId">Courier ID (optional)</Label>
            <Input
              id="courierId"
              name="courierId"
              type="text"
              placeholder="Leave blank for auto-selection"
              value={formData.courierId}
              onChange={handleInputChange}
            />
          </div>
          
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={createShipment} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Truck className="mr-2 h-4 w-4 animate-spin" />
                Creating Shipment...
              </>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" />
                Create Shipment
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}