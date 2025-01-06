import { AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InventoryDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        {/* Additional inventory metrics */}
      </div>

      {/* Material requirements planning section */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Requirements</CardTitle>
        </CardHeader>
        <CardContent>{/* MRP table will go here */}</CardContent>
      </Card>
    </div>
  );
}
