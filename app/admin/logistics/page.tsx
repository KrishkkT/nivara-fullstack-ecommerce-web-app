import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WarehouseManagement } from "@/components/admin/warehouse-management";
import { WaybillPrefetch } from "@/components/admin/waybill-prefetch";
import { ShipmentCreation } from "@/components/admin/shipment-creation";
import { ShipmentManagement } from "@/components/admin/shipment-management";
import { NdrManagement } from "@/components/admin/ndr-management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LogisticsPage() {
  return (
    <div className="container py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Logistics Management</CardTitle>
          <CardDescription>Manage shipping and logistics with Delhivery</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage warehouses, waybills, shipments, and handle NDR (Not Delivered Response) cases.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="shipments" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="create">Create Shipment</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="waybills">Waybills</TabsTrigger>
          <TabsTrigger value="ndr">NDR Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shipments">
          <ShipmentManagement />
        </TabsContent>
        
        <TabsContent value="create">
          <ShipmentCreation />
        </TabsContent>
        
        <TabsContent value="warehouses">
          <WarehouseManagement />
        </TabsContent>
        
        <TabsContent value="waybills">
          <WaybillPrefetch />
        </TabsContent>
        
        <TabsContent value="ndr">
          <NdrManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}