import { PincodeChecker } from "@/components/pincode-checker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PincodeCheckerPage() {
  return (
    <div className="container py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Delivery Availability Checker</CardTitle>
          <CardDescription>Check if we deliver to your area</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Enter your pincode to check if we deliver to your location.
          </p>
        </CardContent>
      </Card>
      
      <PincodeChecker />
    </div>
  );
}