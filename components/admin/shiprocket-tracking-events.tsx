'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShiprocketTrackingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking Events</CardTitle>
        <CardDescription>View shipment tracking events</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Tracking events will appear here.</p>
      </CardContent>
    </Card>
  );
}