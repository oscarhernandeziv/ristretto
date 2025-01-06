import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DocumentLibrary() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search documents..." className="max-w-sm" />
      </div>

      <Tabs defaultValue="sops" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sops">SOPs</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
        </TabsList>
        <TabsContent value="sops">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Document cards will go here */}
          </div>
        </TabsContent>
        {/* Additional tab content */}
      </Tabs>
    </div>
  );
}
