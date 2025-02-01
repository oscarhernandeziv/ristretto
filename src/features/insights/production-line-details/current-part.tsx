import { History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CurrentPartProps {
  partName: string;
  partNumber: string;
}

export function CurrentPart({ partName, partNumber }: CurrentPartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Part</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Name</div>
            <div className="text-lg font-medium">{partName}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Part Number</div>
            <div className="text-lg font-medium">{partNumber}</div>
          </div>
          <Button variant="outline" className="w-full">
            <History className="mr-2 h-4 w-4" />
            View history
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
