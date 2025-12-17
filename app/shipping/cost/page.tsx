import { ShippingCostEstimator } from "@/components/shipping-cost-estimator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShippingCostPage() {
  return (
    <div className="container py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Shipping Cost Estimator</CardTitle>
          <CardDescription>Estimate shipping costs before checkout</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Enter your delivery pincode and package weight to estimate shipping costs.
          </p>
        </CardContent>
      </Card>
      
      <ShippingCostEstimator />
    </div>
  );
}