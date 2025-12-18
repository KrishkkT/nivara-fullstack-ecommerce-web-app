import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WarehouseManagement } from "@/components/admin/warehouse-management";
import { WaybillPrefetch } from "@/components/admin/waybill-prefetch";
import { ShiprocketShipmentCreation } from "@/components/admin/shiprocket-shipment-creation";
import { ShiprocketShipmentManagement } from "@/components/admin/shiprocket-shipment-management";
import { ShiprocketPickupManagement } from "@/components/admin/shiprocket-pickup-management";
import { NdrManagement } from "@/components/admin/ndr-management";
import { PickupLocationManagement } from "@/components/admin/pickup-location-management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LogisticsPage() {
  return (
    <div className="container py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Logistics Management</CardTitle>
          <CardDescription>Manage shipping and logistics with Shiprocket</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage pickup locations, warehouses, shipments, and handle NDR (Not Delivered Response) cases.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="shipments" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="create">Create Order</TabsTrigger>
          <TabsTrigger value="pickup-locations">Pickup Locations</TabsTrigger>
          <TabsTrigger value="pickups">Request Pickup</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="waybills">Waybills</TabsTrigger>
          <TabsTrigger value="ndr">NDR Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shipments">
          <ShiprocketShipmentManagement />
        </TabsContent>
        
        <TabsContent value="create">
          <ShiprocketShipmentCreation />
        </TabsContent>
        
        <TabsContent value="warehouses">
          <WarehouseManagement />
        </TabsContent>
        
        <TabsContent value="waybills">
          <WaybillPrefetch />
        </TabsContent>
        
        <TabsContent value="pickup-locations">
          <PickupLocationManagement />
        </TabsContent>
        
        <TabsContent value="pickups">
          <ShiprocketPickupManagement />
        </TabsContent>
        
        <TabsContent value="ndr">
          <NdrManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}