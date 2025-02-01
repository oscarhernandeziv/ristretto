"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MachineStatusCard } from "@/features/insights/machine-status-card";
import { ScheduledJobQueue } from "@/features/insights/scheduled-job-queue";
import { type ProductionLineType } from "@/types/common/production-types";

const PRODUCTION_LINE_TYPES: ProductionLineType[] = [
  "roasting",
  "packaging",
  "grinding",
];

// Production line data with analytics
const productionLineData = [
  {
    id: "4211efff-2dde-4001-9bd8-1529735ce209",
    name: "Probat G-120",
    description: "120K Roaster",
    type: "roasting" as const,
    status: "active" as const,
    target_output_per_hour: 770,
    output_unit: "lbs",
    current_item_id: "00163da5-ef16-4ba9-a4f4-689385371eab",
    current_operator_id: null,
    operator: "John Smith", // Dummy operator data
    metrics: {
      goodParts: 385,
      scrap: 0,
      utilization: 78,
      cycleTime: 4.6,
      quality: 99.8,
      oee: 76.74,
    },
    timeline: [
      { status: "running" as const, duration: 60 },
      { status: "maintenance" as const, duration: 20 },
      { status: "running" as const, duration: 20 },
    ],
    currentJob: "Colombian Supremo",
    scheduledJobs: [
      {
        id: "1",
        partNumber: "COL-SUP",
        partName: "Colombian Supremo",
        quantity: 1500,
        startTime: "08:00",
        endTime: "12:00",
      },
      {
        id: "2",
        partNumber: "ETH-YIR",
        partName: "Ethiopian Yirgacheffe",
        quantity: 1200,
        startTime: "13:00",
        endTime: "17:00",
      },
    ],
  },
  {
    id: "5ec52531-0be0-4091-bad0-5be4ae14d045",
    name: "Probat G-90",
    description: "90K Roaster",
    type: "roasting" as const,
    status: "active" as const,
    target_output_per_hour: 612,
    output_unit: "lbs",
    current_item_id: null,
    current_operator_id: null,
    operator: "Sarah Wilson", // Dummy operator data
    metrics: {
      goodParts: 306,
      scrap: 0,
      utilization: 82,
      cycleTime: 4.2,
      quality: 99.9,
      oee: 81.91,
    },
    timeline: [
      { status: "running" as const, duration: 80 },
      { status: "stopped" as const, duration: 10 },
      { status: "running" as const, duration: 10 },
    ],
    currentJob: "Guatemala Antigua",
    scheduledJobs: [
      {
        id: "6",
        partNumber: "GUA-ANT",
        partName: "Guatemala Antigua",
        quantity: 1200,
        startTime: "08:30",
        endTime: "12:30",
      },
      {
        id: "7",
        partNumber: "COS-TAR",
        partName: "Costa Rica Tarrazu",
        quantity: 900,
        startTime: "13:30",
        endTime: "16:30",
      },
    ],
  },
  {
    id: "ab298000-1486-42c0-a101-5e01f3d50a0d",
    name: "Probat G-60",
    description: "60K Roaster",
    type: "roasting" as const,
    status: "active" as const,
    target_output_per_hour: 392,
    output_unit: "lbs",
    current_item_id: null,
    current_operator_id: null,
    operator: "David Chen", // Dummy operator data
    metrics: {
      goodParts: 196,
      scrap: 0,
      utilization: 85,
      cycleTime: 3.8,
      quality: 99.7,
      oee: 84.74,
    },
    timeline: [
      { status: "running" as const, duration: 90 },
      { status: "maintenance" as const, duration: 5 },
      { status: "running" as const, duration: 5 },
    ],
    currentJob: "Kenya AA",
    scheduledJobs: [
      {
        id: "8",
        partNumber: "KEN-AA",
        partName: "Kenya AA",
        quantity: 800,
        startTime: "07:00",
        endTime: "11:00",
      },
      {
        id: "9",
        partNumber: "SUM-MAN",
        partName: "Sumatra Mandheling",
        quantity: 600,
        startTime: "12:00",
        endTime: "15:00",
      },
    ],
  },
  {
    id: "d8f99221-3f31-4480-9280-f7f7196eae5f",
    name: "Toyo",
    description: "Toyo",
    type: "packaging" as const,
    status: "active" as const,
    target_output_per_hour: 1300,
    output_unit: "bags",
    current_item_id: "4246ef6b-0fbf-49e0-84b4-b21bf5dfbf6f",
    current_operator_id: null,
    operator: "Jane Doe", // Dummy operator data
    metrics: {
      goodParts: 650,
      scrap: 12,
      utilization: 77,
      cycleTime: 2.8,
      quality: 98.2,
      oee: 75.5,
    },
    timeline: [
      { status: "running" as const, duration: 70 },
      { status: "stopped" as const, duration: 10 },
      { status: "running" as const, duration: 20 },
    ],
    currentJob: "Breakfast Blend 12oz",
    scheduledJobs: [
      {
        id: "3",
        partNumber: "BB-12",
        partName: "Breakfast Blend 12oz",
        quantity: 5000,
        startTime: "09:00",
        endTime: "14:00",
      },
      {
        id: "4",
        partNumber: "DC-12",
        partName: "Dark City 12oz",
        quantity: 3000,
        startTime: "15:00",
        endTime: "18:00",
      },
    ],
  },
  {
    id: "f8f15af9-013c-4a2c-98bf-7d9416d28315",
    name: "Hand Pack",
    description: "Hand scooping stations",
    type: "packaging" as const,
    status: "active" as const,
    target_output_per_hour: 200,
    output_unit: "bags",
    current_item_id: null,
    current_operator_id: null,
    operator: "Maria Garcia", // Dummy operator data
    metrics: {
      goodParts: 100,
      scrap: 2,
      utilization: 88,
      cycleTime: 18,
      quality: 98.0,
      oee: 86.24,
    },
    timeline: [
      { status: "running" as const, duration: 85 },
      { status: "stopped" as const, duration: 5 },
      { status: "running" as const, duration: 10 },
    ],
    currentJob: "Single Origin Sample Pack",
    scheduledJobs: [
      {
        id: "10",
        partNumber: "SO-PACK",
        partName: "Single Origin Sample Pack",
        quantity: 800,
        startTime: "08:00",
        endTime: "16:00",
      },
    ],
  },
  {
    id: "edfb9617-0549-47ad-b4da-ce080f28823e",
    name: "Weigh Rite",
    description: "WeighRite Station",
    type: "packaging" as const,
    status: "active" as const,
    target_output_per_hour: 200,
    output_unit: "bags",
    current_item_id: null,
    current_operator_id: null,
    operator: "Tom Anderson", // Dummy operator data
    metrics: {
      goodParts: 100,
      scrap: 1,
      utilization: 92,
      cycleTime: 18,
      quality: 99.0,
      oee: 91.08,
    },
    timeline: [
      { status: "running" as const, duration: 95 },
      { status: "maintenance" as const, duration: 5 },
    ],
    currentJob: "5lb Wholesale Bags",
    scheduledJobs: [
      {
        id: "11",
        partNumber: "WH-5LB",
        partName: "5lb Wholesale Bags",
        quantity: 400,
        startTime: "07:00",
        endTime: "15:00",
      },
    ],
  },
  {
    id: "1671ed25-311a-43d9-a4f2-5e5c96b91368",
    name: "Grinder",
    description: "Industrial grinder",
    type: "grinding" as const,
    status: "active" as const,
    target_output_per_hour: 1000,
    output_unit: "lbs",
    current_item_id: null,
    current_operator_id: null,
    operator: "Mike Johnson", // Dummy operator data
    metrics: {
      goodParts: 500,
      scrap: 15,
      utilization: 74,
      cycleTime: 3.6,
      quality: 97.1,
      oee: 71.8,
    },
    timeline: [
      { status: "running" as const, duration: 50 },
      { status: "maintenance" as const, duration: 30 },
      { status: "running" as const, duration: 20 },
    ],
    issue: "Scheduled maintenance at 2 PM",
    scheduledJobs: [
      {
        id: "5",
        partNumber: "BB-GR",
        partName: "Breakfast Blend Ground",
        quantity: 2000,
        startTime: "11:00",
        endTime: "16:00",
      },
    ],
  },
];

export default function OEEDashboard() {
  const [selectedTypes, setSelectedTypes] = useState<ProductionLineType[]>([]);

  const filteredLines =
    selectedTypes.length > 0
      ? productionLineData.filter((line) => selectedTypes.includes(line.type))
      : productionLineData;

  const handleTypeToggle = useCallback(
    (type: ProductionLineType, checked: boolean) => {
      setSelectedTypes((prev) =>
        checked ? [...prev, type] : prev.filter((t) => t !== type)
      );
    },
    []
  );

  return (
    <div className="flex flex-col px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">OEE Dashboard</h2>
          <p className="pb-4 text-sm text-muted-foreground">
            View and manage current OEE levels across all lines.
          </p>
        </div>
        <div className="flex justify-end gap-8 text-sm">
          <div>
            <div className="text-muted-foreground">Overall Utilization</div>
            <div>54%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg. Volume</div>
            <div>0:31.56m</div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg. Downtime Events</div>
            <div>0.2</div>
          </div>
          <div>
            <div className="text-muted-foreground">Avg. Downtime Length</div>
            <div>01:27m</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter
                className="-ms-1 me-2 opacity-60"
                size={16}
                strokeWidth={2}
                aria-hidden="true"
              />
              Line Type
              {selectedTypes.length > 0 && (
                <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                  {selectedTypes.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-36 p-3" align="start">
            <div className="space-y-3">
              <div className="text-xs font-medium text-muted-foreground">
                Filters
              </div>
              <div className="space-y-3">
                {PRODUCTION_LINE_TYPES.map((type, i) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox
                      id={`type-${i}`}
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={(checked) =>
                        handleTypeToggle(type, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`type-${i}`}
                      className="flex grow justify-between gap-2 font-normal capitalize"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLines.map((line) => (
          <div key={line.id} className="flex flex-col space-y-4">
            <Link
              href={{ pathname: `/insights/production-line/${line.id}` }}
              className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <MachineStatusCard
                machineId={line.name}
                status={
                  line.status === "active"
                    ? "running"
                    : line.status === "maintenance"
                      ? "maintenance"
                      : "stopped"
                }
                operator={line.operator}
                metrics={line.metrics}
                timeline={line.timeline}
                currentJob={line.currentJob}
                issue={line.issue}
              />
            </Link>
            <ScheduledJobQueue jobs={line.scheduledJobs} />
          </div>
        ))}
      </div>
    </div>
  );
}
