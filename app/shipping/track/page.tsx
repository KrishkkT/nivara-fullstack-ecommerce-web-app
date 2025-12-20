import { OrderTracker } from "@/components/order-tracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderTrackPage() {
  return (
    <div className="container py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
          <CardDescription>Track the status of your shipment</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
Enter your AWB code or order ID to track your shipment status.
          </p>
        </CardContent>
      </Card>
      
      <OrderTracker />
    </div>
  );
}