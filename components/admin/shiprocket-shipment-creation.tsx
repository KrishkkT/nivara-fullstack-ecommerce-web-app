"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface OrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  weight: number;
}

interface PickupLocation {
  id: number;
  name: string;
  primary: boolean;
}

export function ShiprocketShipmentCreation() {
  const [orderId, setOrderId] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [billingCustomerName, setBillingCustomerName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPincode, setBillingPincode] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [shippingIsBilling, setShippingIsBilling] = useState(true);
  const [shippingCustomerName, setShippingCustomerName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingEmail, setShippingEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("prepaid");
  const [subTotal, setSubTotal] = useState("");
  const [length, setLength] = useState("15");
  const [breadth, setBreadth] = useState("10");
  const [height, setHeight] = useState("5");
  const [items, setItems] = useState<OrderItem[]>([
    { name: "", sku: "", units: 1, selling_price: 0, weight: 0.5 }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchPickupLocations = async () => {
    try {
      const response = await fetch("/api/shiprocket/pickup-locations");
      const data = await response.json();
      
      if (response.ok) {
        setPickupLocations(data.pickup_locations || []);
        // Set default to primary location
        const primaryLocation = data.pickup_locations?.find((loc: PickupLocation) => loc.primary);
        if (primaryLocation) {
          setPickupLocation(primaryLocation.id.toString());
        }
      }
    } catch (error) {
      console.error("Failed to fetch pickup locations:", error);
    }
  };

  useEffect(() => {
    fetchPickupLocations();
  }, []);

  const addItem = () => {
    setItems([...items, { name: "", sku: "", units: 1, selling_price: 0, weight: 0.5 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
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
      if (!orderId || !pickupLocation || !billingCustomerName || !billingAddress || 
          !billingCity || !billingState || !billingPincode || !billingPhone) {
        throw new Error("Please fill in all required billing fields");
      }

      if (!shippingIsBilling && (!shippingCustomerName || !shippingAddress || 
          !shippingCity || !shippingState || !shippingPincode || !shippingPhone)) {
        throw new Error("Please fill in all required shipping fields");
      }

      if (billingPincode.length !== 6) {
        throw new Error("Please enter a valid 6-digit billing pincode");
      }

      if (!shippingIsBilling && shippingPincode.length !== 6) {
        throw new Error("Please enter a valid 6-digit shipping pincode");
      }

      // Validate items
      let total = 0;
      for (const item of items) {
        if (!item.name || !item.sku || item.units <= 0 || item.selling_price <= 0 || item.weight <= 0) {
          throw new Error("Please fill in all item details correctly");
        }
        total += item.selling_price * item.units;
      }

      // Find the selected pickup location name
      const selectedLocation = pickupLocations.find(loc => loc.id.toString() === pickupLocation);
      const pickupLocationName = selectedLocation ? selectedLocation.name : pickupLocation;
      
      // Prepare order data according to Shiprocket requirements
      const orderData = {
        order_id: orderId,
        pickup_location: pickupLocationName, // Send the name of the pickup location
        billing_customer_name: billingCustomerName,
        billing_last_name: "",
        billing_address: billingAddress + (billingAddress2 ? `, ${billingAddress2}` : ""),
        billing_address_2: "",
        billing_city: billingCity,
        billing_pincode: billingPincode,
        billing_state: billingState,
        billing_country: "India",
        billing_email: billingEmail,
        billing_phone: billingPhone,
        shipping_is_billing: shippingIsBilling,
        shipping_customer_name: shippingIsBilling ? billingCustomerName : shippingCustomerName,
        shipping_last_name: "",
        shipping_address: shippingIsBilling ? billingAddress + (billingAddress2 ? `, ${billingAddress2}` : "") : shippingAddress + (shippingAddress2 ? `, ${shippingAddress2}` : ""),
        shipping_address_2: "",
        shipping_city: shippingIsBilling ? billingCity : shippingCity,
        shipping_pincode: shippingIsBilling ? billingPincode : shippingPincode,
        shipping_state: shippingIsBilling ? billingState : shippingState,
        shipping_country: "India",
        shipping_email: shippingIsBilling ? billingEmail : shippingEmail,
        shipping_phone: shippingIsBilling ? billingPhone : shippingPhone,
        order_items: items,
        payment_method: paymentMethod,
        sub_total: total.toFixed(2),
        length: parseFloat(length),
        breadth: parseFloat(breadth),
        height: parseFloat(height),
        weight: items.reduce((sum, item) => sum + (item.weight * item.units), 0)
      };

      const response = await fetch("/api/shiprocket/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setSuccess(`Order created successfully! Shiprocket Order ID: ${data.order_id}${data.awb_code ? `, AWB: ${data.awb_code}` : ''}`);
      
      // Reset form
      setOrderId("");
      setBillingCustomerName("");
      setBillingAddress("");
      setBillingAddress2("");
      setBillingCity("");
      setBillingState("");
      setBillingPincode("");
      setBillingPhone("");
      setBillingEmail("");
      setShippingIsBilling(true);
      setShippingCustomerName("");
      setShippingAddress("");
      setShippingAddress2("");
      setShippingCity("");
      setShippingState("");
      setShippingPincode("");
      setShippingPhone("");
      setShippingEmail("");
      setPaymentMethod("prepaid");
      setSubTotal("");
      setItems([{ name: "", sku: "", units: 1, selling_price: 0, weight: 0.5 }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
        <CardDescription>Create a new order with Shiprocket</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order-id">Order ID *</Label>
                <Input
                  id="order-id"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pickup-location">Pickup Location *</Label>
                <Select value={pickupLocation} onValueChange={setPickupLocation} disabled={loading || pickupLocations.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pickup location" />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name} {location.primary && "(Primary)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {pickupLocations.length === 0 && (
                  <p className="text-sm text-muted-foreground">No pickup locations configured in Shiprocket.</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-customer-name">Customer Name *</Label>
                <Input
                  id="billing-customer-name"
                  value={billingCustomerName}
                  onChange={(e) => setBillingCustomerName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-address">Billing Address Line 1 *</Label>
                <Input
                  id="billing-address"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-address2">Billing Address Line 2</Label>
                <Input
                  id="billing-address2"
                  value={billingAddress2}
                  onChange={(e) => setBillingAddress2(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-city">Billing City *</Label>
                <Input
                  id="billing-city"
                  value={billingCity}
                  onChange={(e) => setBillingCity(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-state">Billing State *</Label>
                <Input
                  id="billing-state"
                  value={billingState}
                  onChange={(e) => setBillingState(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-pincode">Billing Pincode *</Label>
                <Input
                  id="billing-pincode"
                  type="text"
                  maxLength={6}
                  value={billingPincode}
                  onChange={(e) => setBillingPincode(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-phone">Billing Phone *</Label>
                <Input
                  id="billing-phone"
                  type="tel"
                  value={billingPhone}
                  onChange={(e) => setBillingPhone(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-email">Billing Email</Label>
                <Input
                  id="billing-email"
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shipping-is-billing"
                  checked={shippingIsBilling}
                  onCheckedChange={(checked) => setShippingIsBilling(checked as boolean)}
                  disabled={loading}
                />
                <Label htmlFor="shipping-is-billing">Shipping address same as billing</Label>
              </div>
              
              {!shippingIsBilling && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="shipping-customer-name">Shipping Name *</Label>
                    <Input
                      id="shipping-customer-name"
                      value={shippingCustomerName}
                      onChange={(e) => setShippingCustomerName(e.target.value)}
                      required={!shippingIsBilling}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-address">Shipping Address Line 1 *</Label>
                    <Input
                      id="shipping-address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required={!shippingIsBilling}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-address2">Shipping Address Line 2</Label>
                    <Input
                      id="shipping-address2"
                      value={shippingAddress2}
                      onChange={(e) => setShippingAddress2(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-city">Shipping City *</Label>
                    <Input
                      id="shipping-city"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      required={!shippingIsBilling}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-state">Shipping State *</Label>
                    <Input
                      id="shipping-state"
                      value={shippingState}
                      onChange={(e) => setShippingState(e.target.value)}
                      required={!shippingIsBilling}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-pincode">Shipping Pincode *</Label>
                    <Input
                      id="shipping-pincode"
                      type="text"
                      maxLength={6}
                      value={shippingPincode}
                      onChange={(e) => setShippingPincode(e.target.value)}
                      required={!shippingIsBilling}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-phone">Shipping Phone *</Label>
                    <Input
                      id="shipping-phone"
                      type="tel"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      required={!shippingIsBilling}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping-email">Shipping Email</Label>
                    <Input
                      id="shipping-email"
                      type="email"
                      value={shippingEmail}
                      onChange={(e) => setShippingEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prepaid">Prepaid</SelectItem>
                    <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="breadth">Breadth (cm)</Label>
                  <Input
                    id="breadth"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={breadth}
                    onChange={(e) => setBreadth(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Order Items</h3>
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
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.selling_price}
                    onChange={(e) => updateItem(index, "selling_price", parseFloat(e.target.value) || 0)}
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
          
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Order...
                </>
              ) : (
                "Create Order"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}