"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface ShipmentItem {
  name: string;
  sku: string;
  units: number;
  unit_price: number;
  weight: number;
}

interface PickupLocation {
  id: number;
  name: string;
  shiprocket_location_id: number;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
  phone: string | null;
  email: string | null;
  primary: boolean;
}

export function ShipmentCreation() {
  const [orderId, setOrderId] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState<PickupLocation[]>([]);
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryAddress1, setDeliveryAddress1] = useState("");
  const [deliveryAddress2, setDeliveryAddress2] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryEmail, setDeliveryEmail] = useState("");
  const [cod, setCod] = useState(false);
  const [codAmount, setCodAmount] = useState("");
  const [items, setItems] = useState<ShipmentItem[]>([
    { name: "", sku: "", units: 1, unit_price: 0, weight: 0.5 }
  ]);
  
  useEffect(() => {
    // Fetch warehouses
    const fetchWarehouses = async () => {
      try {
        const response = await fetch("/api/admin/warehouses");
        const data = await response.json();
        
        if (response.ok) {
          setWarehouses(data.warehouses || []);
        }
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      }
    };
    
    fetchWarehouses();
  }, []);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addItem = () => {
    setItems([...items, { name: "", sku: "", units: 1, unit_price: 0, weight: 0.5 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: keyof ShipmentItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!orderId || !warehouse || !deliveryName || !deliveryAddress1 || 
          !deliveryCity || !deliveryState || !deliveryPincode || !deliveryPhone) {
        throw new Error("Please fill in all required fields");
      }
      
      // Validate warehouse
      if (warehouses.length === 0) {
        throw new Error("No pickup locations configured. Please add pickup locations first.");
      }
      
      if (!warehouses.some(w => w.name === warehouse)) {
        throw new Error("Selected pickup location not found.");
      }

      if (deliveryPincode.length !== 6) {
        throw new Error("Please enter a valid 6-digit pincode");
      }

      // Validate items
      for (const item of items) {
        if (!item.name || !item.sku || item.units <= 0 || item.unit_price <= 0 || item.weight <= 0) {
          throw new Error("Please fill in all item details correctly");
        }
      }

      // Prepare shipment data according to Shiprocket requirements
      const selectedWarehouse = warehouses.find(w => w.name === warehouse);
      
      // Calculate total weight and value
      const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.units), 0);
      const totalValue = items.reduce((sum, item) => sum + (item.unit_price * item.units), 0);
      const totalPieces = items.reduce((sum, item) => sum + item.units, 0);
      
      const shipmentData = {
        orderId: parseInt(orderId),
        shipment: {
          order_id: orderId,
          shipment_date: new Date().toISOString(),
          pickup_location: selectedWarehouse?.warehouse_name || warehouse,
          billing_customer_name: deliveryName,
          billing_address: deliveryAddress1,
          billing_address_2: deliveryAddress2 || "",
          billing_city: deliveryCity,
          billing_pincode: deliveryPincode,
          billing_state: deliveryState,
          billing_country: "India",
          billing_email: deliveryEmail,
          billing_phone: deliveryPhone,
          shipping_is_billing: true,
          order_items: items.map(item => ({
            name: item.name,
            sku: item.sku,
            units: item.units,
            selling_price: item.unit_price,
            weight: item.weight
          })),
          payment_method: cod ? "COD" : "Prepaid",
          total_amount: totalValue,
          total_weight: totalWeight,
          cod_amount: cod ? parseFloat(codAmount) || 0 : 0,
          courier_partner: "",
          package_length: 30,
          package_breadth: 20,
          package_height: 10,
          // These will be filled by the API
          awb_code: "",
          courier_company_id: "",
          shipment_id: ""
        }
      };

      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-shipment",
          ...shipmentData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create shipment");
      }

      // Check if the shipment was actually successful according to Shiprocket
      if (data.shipment && data.shipment.awb_code) {
        setSuccess(`Shipment created successfully! AWB Code: ${data.shipment.awb_code}`);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Unexpected response format from Shiprocket API");
      }
      
      // Reset form
      setOrderId("");
      setWarehouse("");
      setDeliveryName("");
      setDeliveryAddress1("");
      setDeliveryAddress2("");
      setDeliveryCity("");
      setDeliveryState("");
      setDeliveryPincode("");
      setDeliveryPhone("");
      setDeliveryEmail("");
      setCod(false);
      setCodAmount("");
      setItems([{ name: "", sku: "", units: 1, unit_price: 0, weight: 0.5 }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const verifyShipment = async (awb_code: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verify-shipment",
          awb_code: awb_code
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify shipment");
      }

      // Check if shipment exists in Shiprocket system
      if (data.ShipmentData && data.ShipmentData.length > 0) {
        const shipment = data.ShipmentData[0];
        alert(`Shipment verified!\nStatus: ${shipment.ScanDetail?.Scans?.[0]?.ScanType || 'Unknown'}\nLocation: ${shipment.ScanDetail?.Scans?.[0]?.ScannedLocation || 'Unknown'}\nAWB: ${awb_code}`);
      } else {
        alert("Shipment not found in Shiprocket system. It may have been created but not properly linked to your account.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Shipment</CardTitle>
        <CardDescription>Manifest a new shipment with Shiprocket</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order-id">Order ID *</Label>
                <Input
                  id="order-id"
                  type="number"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse *</Label>
                <Select value={warehouse} onValueChange={setWarehouse} disabled={loading || warehouses.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => (
                      <SelectItem key={w.id} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {warehouses.length === 0 && (
                  <p className="text-sm text-muted-foreground">No pickup locations configured. Please add pickup locations first.</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-name">Recipient Name *</Label>
                <Input
                  id="delivery-name"
                  value={deliveryName}
                  onChange={(e) => setDeliveryName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-address1">Address Line 1 *</Label>
                <Input
                  id="delivery-address1"
                  value={deliveryAddress1}
                  onChange={(e) => setDeliveryAddress1(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-address2">Address Line 2</Label>
                <Input
                  id="delivery-address2"
                  value={deliveryAddress2}
                  onChange={(e) => setDeliveryAddress2(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delivery-city">City *</Label>
                <Input
                  id="delivery-city"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-state">State *</Label>
                <Input
                  id="delivery-state"
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-pincode">Pincode *</Label>
                <Input
                  id="delivery-pincode"
                  type="text"
                  maxLength={6}
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-phone">Phone *</Label>
                <Input
                  id="delivery-phone"
                  type="tel"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-email">Email</Label>
                <Input
                  id="delivery-email"
                  type="email"
                  value={deliveryEmail}
                  onChange={(e) => setDeliveryEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Shipment Items</h3>
              <Button type="button" variant="outline" onClick={addItem} disabled={loading}>
                Add Item
              </Button>
            </div>
            
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border rounded-lg">
                <div className="md:col-span-2 space-y-2">
                  <Label>Item Name *</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>SKU *</Label>
                  <Input
                    value={item.sku}
                    onChange={(e) => updateItem(index, "sku", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Units *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.units}
                    onChange={(e) => updateItem(index, "units", parseInt(e.target.value) || 1)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Unit Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value) || 0)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Weight (kg) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.weight}
                    onChange={(e) => updateItem(index, "weight", parseFloat(e.target.value) || 0.5)}
                    required
                    disabled={loading}
                  />
                </div>
                
                {items.length > 1 && (
                  <div className="md:col-span-5 flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => removeItem(index)}
                      disabled={loading}
                    >
                      Remove Item
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Payment Options</h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="cod"
                checked={cod}
                onCheckedChange={(checked) => setCod(checked as boolean)}
                disabled={loading}
              />
              <Label htmlFor="cod">Cash on Delivery (COD)</Label>
            </div>
            
            {cod && (
              <div className="space-y-2">
                <Label htmlFor="cod-amount">COD Amount *</Label>
                <Input
                  id="cod-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={codAmount}
                  onChange={(e) => setCodAmount(e.target.value)}
                  required={cod}
                  disabled={loading}
                />
              </div>
            )}
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
                  <AlertDescription>
                    <div className="flex justify-between items-center">
                      <span>{success}</span>
                      {success.includes("AWB Code:") && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const awbMatch = success.match(/AWB Code: ([A-Z0-9]+)/);
                            if (awbMatch && awbMatch[1]) verifyShipment(awbMatch[1]);
                          }}
                        >
                          Verify Shipment
                        </Button>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Shipment...
                </>
              ) : (
                "Create Shipment"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
