"use client";

import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CheckCircle2,
  Files,
  LogOut,
  Power,
  Puzzle,
  RefreshCw,
  Target,
  Unlink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeclareProductionDialog } from "@/features/make/declare-production-dialog";
import { useStartWorkOrder } from "@/lib/hooks/use-start-work-order";
import { useToast } from "@/lib/hooks/use-toast";
import {
  type ProductionLine,
  type WorkOrder,
  getCompletedWorkOrders,
  getProductionLines,
  getWorkOrders,
} from "@/lib/queries/work-order";

export default function OperatorPanel() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [declareProductionOpen, setDeclareProductionOpen] = useState(false);
  const { toast } = useToast();

  // Fetch production lines
  const { data: productionLines } = useQuery({
    queryKey: ["productionLines"],
    queryFn: getProductionLines,
  });

  // Fetch work orders for selected line
  const { data: workOrders } = useQuery({
    queryKey: ["workOrders", selectedLineId],
    queryFn: () => getWorkOrders(selectedLineId),
    enabled: !!selectedLineId,
  });

  // Fetch completed work orders for selected line
  const { data: completedWorkOrders } = useQuery({
    queryKey: ["completedWorkOrders", selectedLineId],
    queryFn: () => getCompletedWorkOrders(selectedLineId),
    enabled: !!selectedLineId,
  });

  // Get current active work order
  const activeWorkOrder = workOrders?.find(
    (wo: WorkOrder) => wo.status === "started"
  );

  // Initialize start work order mutation
  const startWorkOrder = useStartWorkOrder({
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate progress for active work order
  const calculateProgress = (workOrder: WorkOrder) => {
    if (!workOrder.actual_quantity) return 0;
    return Math.round(
      (workOrder.actual_quantity / workOrder.planned_quantity) * 100
    );
  };

  const selectedLine = productionLines?.find(
    (line: ProductionLine) => line.id === selectedLineId
  );

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Header section */}
      <div className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {selectedLine && <span>{selectedLine.name} - </span>}
              Operator Panel
            </h2>
            <p className="text-sm text-muted-foreground">
              Track and execute production.
            </p>
          </div>
          <Select
            value={selectedLineId || ""}
            onValueChange={(value) => setSelectedLineId(value)}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a production line" />
            </SelectTrigger>
            <SelectContent>
              {productionLines?.map((line: ProductionLine) => (
                <SelectItem key={line.id} value={line.id}>
                  {line.name} - {line.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Time and status header */}
      <header className="flex h-14 items-center justify-between border-b pb-4">
        <div className="flex items-center gap-8">
          <div className="flex gap-8 text-muted-foreground">
            <div>
              <div className="text-sm">{format(currentTime, "yyyy/MM/dd")}</div>
              <div className="text-xs">
                {currentTime
                  .toLocaleDateString("en-US", { weekday: "long" })
                  .toUpperCase()}
              </div>
            </div>
            <div>
              <div className="text-sm">{format(currentTime, "HH:mm:ss")}</div>
              <div className="text-xs">CURRENT TIME</div>
            </div>
            {selectedLine && (
              <div>
                <div className="text-sm">{selectedLine.name}</div>
                <div className="text-xs">
                  {selectedLine.status.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Power className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Target className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {selectedLineId ? (
        <div className="grid gap-3 lg:grid-cols-[40%_60%]">
          {/* Left Panel */}
          <div className="space-y-3">
            <div className="border-b">
              <div className="flex">
                <button className="border-b-2 border-primary px-4 py-2 text-sm font-medium text-primary">
                  Ongoing production
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Production history
                </button>
              </div>
            </div>

            {activeWorkOrder ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Production Order Data */}
                <Card className="rounded-[0.3rem]">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Work Order #
                        </div>
                        <div className="max-w-[200px] truncate text-lg">
                          {activeWorkOrder.work_order_number}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          Item Number
                        </div>
                        <div className="max-w-[200px] truncate">
                          {activeWorkOrder.item.number}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          Item Name
                        </div>
                        <div className="max-w-[200px]">
                          {activeWorkOrder.item.description}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          Planned Quantity
                        </div>
                        <div className="max-w-[200px] truncate">
                          {activeWorkOrder.planned_quantity}{" "}
                          {selectedLine?.output_unit}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          Start Time
                        </div>
                        <div className="max-w-[200px] truncate">
                          {format(
                            new Date(
                              activeWorkOrder.actual_start_time ||
                                activeWorkOrder.planned_start_time
                            ),
                            "HH:mm"
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          End Time
                        </div>
                        <div className="max-w-[200px] truncate">
                          {activeWorkOrder.planned_end_time
                            ? format(
                                new Date(activeWorkOrder.planned_end_time),
                                "HH:mm"
                              )
                            : "Not set"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Tracking */}
                <Card className="rounded-[0.3rem]">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-primary">
                          <div className="text-center">
                            <div className="text-4xl font-bold">
                              {calculateProgress(activeWorkOrder)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              PRODUCING
                            </div>
                            <div className="text-lg">
                              {activeWorkOrder.actual_quantity || 0} /{" "}
                              {activeWorkOrder.planned_quantity}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span>{calculateProgress(activeWorkOrder)}%</span>
                        </div>
                        <Progress
                          value={calculateProgress(activeWorkOrder)}
                          className="h-2"
                        />
                      </div>

                      <div className="text-center text-sm">
                        <div className="text-muted-foreground">
                          Target Output Rate
                        </div>
                        <div className="font-medium">
                          {selectedLine?.target_output_per_hour}{" "}
                          {selectedLine?.output_unit}/hour
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">No active work order</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="secondary"
                className="h-18 rounded-[0.3rem] p-4 [&_svg]:!h-8 [&_svg]:!w-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <Files />
                  <span className="whitespace-normal text-center text-sm font-medium">
                    WORKING INSTRUCTIONS
                  </span>
                </div>
              </Button>
              <Button
                variant="secondary"
                className="h-18 rounded-[0.3rem] p-4 [&_svg]:!h-8 [&_svg]:!w-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <Puzzle />
                  <span className="whitespace-normal text-center text-sm font-medium">
                    DISPLAY FORMULA/BOM
                  </span>
                </div>
              </Button>
              <Button
                variant="destructive"
                className="h-18 rounded-[0.3rem] p-4 [&_svg]:!h-8 [&_svg]:!w-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <Unlink />
                  <span className="whitespace-normal text-center text-sm font-medium">
                    REPORT DOWNTIME
                  </span>
                </div>
              </Button>
              <Button
                variant="default"
                className="h-18 rounded-[0.3rem] bg-primary p-4 text-primary-foreground hover:bg-primary/90 [&_svg]:!h-8 [&_svg]:!w-8"
                onClick={() => setDeclareProductionOpen(true)}
                disabled={!activeWorkOrder}
              >
                <div className="flex flex-col items-center gap-4">
                  <CheckCircle2 />
                  <span className="whitespace-normal text-center text-sm font-medium">
                    DECLARE PRODUCTION
                  </span>
                </div>
              </Button>
            </div>

            {activeWorkOrder && (
              <DeclareProductionDialog
                workOrder={activeWorkOrder}
                open={declareProductionOpen}
                onOpenChangeAction={setDeclareProductionOpen}
              />
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-3">
            <div className="border-b">
              <div className="flex flex-wrap">
                <button className="border-b-2 border-primary px-4 py-2 text-sm font-medium text-primary">
                  Schedule
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Downtime
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Changeovers
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Quality
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Maintenance
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  Notifications
                </button>
                <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  OEE
                </button>
              </div>
            </div>

            <Card className="rounded-[0.3rem]">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <Input
                    type="search"
                    placeholder="Search work orders..."
                    className="rounded-[0.3rem]"
                  />

                  <Tabs defaultValue="production">
                    <TabsList className="flex w-full justify-start border-b bg-transparent">
                      <TabsTrigger
                        value="production"
                        className="border-b-2 px-4 py-2 text-sm font-medium data-[state=active]:border-primary data-[state=active]:text-primary"
                      >
                        CURRENT ORDERS
                      </TabsTrigger>
                      <TabsTrigger
                        value="completed"
                        className="border-b-2 px-4 py-2 text-sm font-medium data-[state=active]:border-primary data-[state=active]:text-primary"
                      >
                        COMPLETED
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="production">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-muted/50">
                            <TableHead className="w-[120px] text-muted-foreground">
                              WO #
                            </TableHead>
                            <TableHead className="w-[150px] text-muted-foreground">
                              Item Number
                            </TableHead>
                            <TableHead className="min-w-[300px] text-muted-foreground">
                              Item Name
                            </TableHead>
                            <TableHead className="w-[100px] text-muted-foreground">
                              Plan Qty
                            </TableHead>
                            <TableHead className="w-[100px] text-muted-foreground">
                              Start Time
                            </TableHead>
                            <TableHead className="w-[100px] text-muted-foreground">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workOrders?.map((order: WorkOrder) => (
                            <TableRow
                              key={order.id}
                              className="border-border hover:bg-muted/50"
                            >
                              <TableCell className="w-[100px] px-3 py-2">
                                {order.work_order_number}
                              </TableCell>
                              <TableCell className="w-[100px] px-3 py-2">
                                {order.item.number}
                              </TableCell>
                              <TableCell className="min-w-[300px] px-3 py-2">
                                {order.item.description}
                              </TableCell>
                              <TableCell className="w-[100px] px-3 py-2">
                                {order.planned_quantity}
                              </TableCell>
                              <TableCell className="w-[100px] px-3 py-2">
                                {format(
                                  new Date(order.planned_start_time),
                                  "HH:mm"
                                )}
                              </TableCell>
                              <TableCell className="w-[100px] px-3 py-2">
                                {order.status === "planned" ||
                                order.status === "released" ? (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      startWorkOrder.mutate({
                                        workOrderId: order.id,
                                        productionLineId: selectedLineId!,
                                      })
                                    }
                                    disabled={
                                      startWorkOrder.isPending ||
                                      !!activeWorkOrder ||
                                      !selectedLineId
                                    }
                                  >
                                    {startWorkOrder.isPending &&
                                    startWorkOrder.variables?.workOrderId ===
                                      order.id ? (
                                      <span className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                        Starting...
                                      </span>
                                    ) : (
                                      "Start"
                                    )}
                                  </Button>
                                ) : (
                                  <span className="capitalize">
                                    {order.status}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          {(!workOrders || workOrders.length === 0) && (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="h-24 text-center"
                              >
                                <span className="text-sm text-muted-foreground">
                                  No work orders scheduled
                                </span>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    <TabsContent value="completed">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border hover:bg-muted/50">
                            <TableHead className="w-[120px] text-muted-foreground">
                              WO #
                            </TableHead>
                            <TableHead className="w-[150px] text-muted-foreground">
                              Item Number
                            </TableHead>
                            <TableHead className="min-w-[300px] text-muted-foreground">
                              Product Description
                            </TableHead>
                            <TableHead className="w-[100px] text-muted-foreground">
                              Actual Qty
                            </TableHead>
                            <TableHead className="w-[100px] text-muted-foreground">
                              End Time
                            </TableHead>
                            <TableHead className="w-[100px] text-muted-foreground">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedWorkOrders?.map((order: WorkOrder) => (
                            <TableRow
                              key={order.id}
                              className="border-border hover:bg-muted/50"
                            >
                              <TableCell className="w-[100px] px-3 py-2">
                                {order.work_order_number}
                              </TableCell>
                              <TableCell className="w-[100px] px-3 py-2">
                                {order.item.number}
                              </TableCell>
                              <TableCell className="min-w-[300px] px-3 py-2">
                                {order.item.description}
                              </TableCell>
                              <TableCell className="w-[100px] px-3 py-2">
                                {order.actual_quantity}
                              </TableCell>
                              <TableCell className="w-[100px] px-3 py-2">
                                {order.actual_end_time
                                  ? format(
                                      new Date(order.actual_end_time),
                                      "HH:mm"
                                    )
                                  : "-"}
                              </TableCell>
                              <TableCell className="w-[100px] px-3 py-2">
                                <span className="capitalize">
                                  {order.status}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                          {(!completedWorkOrders ||
                            completedWorkOrders.length === 0) && (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="h-24 text-center"
                              >
                                <span className="text-sm text-muted-foreground">
                                  No completed work orders
                                </span>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">
            Please select a production line to view work orders
          </p>
        </div>
      )}
    </div>
  );
}
