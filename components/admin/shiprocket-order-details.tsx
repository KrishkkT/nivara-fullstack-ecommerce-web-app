'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShiprocketOrderDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
        <CardDescription>View and manage Shiprocket orders</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Order details will appear here.</p>
      </CardContent>
    </Card>
  );
}