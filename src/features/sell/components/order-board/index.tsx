import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OrderBoard() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Order cards will go here */}
          </div>
        </TabsContent>
        {/* Additional tab content */}
      </Tabs>
    </div>
  );
}
