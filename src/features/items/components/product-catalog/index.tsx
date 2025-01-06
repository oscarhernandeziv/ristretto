import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ProductCatalog() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." className="max-w-sm" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Database</CardTitle>
        </CardHeader>
        <CardContent>{/* Product grid/table will go here */}</CardContent>
      </Card>
    </div>
  );
}
