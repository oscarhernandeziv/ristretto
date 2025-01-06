import { Activity, AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductionDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lines</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4/6</div>
          </CardContent>
        </Card>
        {/* Additional metric cards */}
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Line 2 maintenance scheduled in 30 minutes
        </AlertDescription>
      </Alert>

      {/* Production lines grid will go here */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Production line cards */}
      </div>
    </div>
  );
}
