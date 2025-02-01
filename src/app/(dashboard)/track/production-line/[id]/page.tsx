"use client";

import { notFound, useParams } from "next/navigation";

import { CurrentPart } from "@/features/insights/production-line-details/current-part";
import { GoalForecast } from "@/features/insights/production-line-details/goal-forecast";
import { HourTimeline } from "@/features/insights/production-line-details/hour-timeline";
import { JobOverview } from "@/features/insights/production-line-details/job-overview";
import { MachineHeader } from "@/features/insights/production-line-details/machine-header";
import { WeeklySchedule } from "@/features/insights/production-line-details/weekly-schedule";

const weeklyScheduleData = [
  {
    date: "2024-01-22",
    entries: [
      {
        partNumber: "1234567",
        partName: "Widget X-1000",
        targetQuantity: 100,
        actualQuantity: 85,
        status: "completed" as const,
        startTime: "07:00",
        endTime: "15:00",
      },
      {
        partNumber: "1234568",
        partName: "Widget X-2000",
        targetQuantity: 50,
        actualQuantity: 45,
        status: "completed" as const,
        startTime: "15:00",
        endTime: "23:00",
      },
    ],
  },
  {
    date: "2024-01-23",
    entries: [
      {
        partNumber: "1234567",
        partName: "Widget X-1000",
        targetQuantity: 100,
        actualQuantity: 55,
        status: "in-progress" as const,
        startTime: "07:00",
        endTime: "15:00",
      },
      {
        partNumber: "1234569",
        partName: "Widget X-3000",
        targetQuantity: 75,
        status: "scheduled" as const,
        startTime: "15:00",
        endTime: "23:00",
      },
    ],
  },
  {
    date: "2024-01-24",
    entries: [
      {
        partNumber: "1234570",
        partName: "Widget X-4000",
        targetQuantity: 120,
        status: "scheduled" as const,
        startTime: "07:00",
        endTime: "19:00",
      },
    ],
  },
  {
    date: "2024-01-25",
    entries: [
      {
        partNumber: "1234571",
        partName: "Widget X-5000",
        targetQuantity: 90,
        status: "scheduled" as const,
        startTime: "07:00",
        endTime: "15:00",
      },
      {
        partNumber: "1234572",
        partName: "Widget X-6000",
        targetQuantity: 60,
        status: "scheduled" as const,
        startTime: "15:00",
        endTime: "23:00",
      },
    ],
  },
  {
    date: "2024-01-26",
    entries: [
      {
        partNumber: "1234573",
        partName: "Widget X-7000",
        targetQuantity: 150,
        status: "scheduled" as const,
        startTime: "07:00",
        endTime: "19:00",
      },
    ],
  },
  {
    date: "2024-01-27",
    entries: [
      {
        partNumber: "1234574",
        partName: "Widget X-8000",
        targetQuantity: 80,
        status: "scheduled" as const,
        startTime: "07:00",
        endTime: "15:00",
      },
    ],
  },
  {
    date: "2024-01-28",
    entries: [
      {
        partNumber: "1234575",
        partName: "Widget X-9000",
        targetQuantity: 100,
        status: "scheduled" as const,
        startTime: "07:00",
        endTime: "19:00",
      },
    ],
  },
];

// Production line data with analytics - this would typically come from an API
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
    operator: "John Smith",
    metrics: {
      goodParts: 385,
      scrap: 0,
      utilization: 78,
      cycleTime: 4.6,
      quality: 99.8,
      oee: 76.74,
    },
    timeline: [
      { status: "running" as const, startHour: 0, duration: 4 },
      { status: "maintenance" as const, startHour: 4, duration: 2 },
      { status: "running" as const, startHour: 6, duration: 6 },
      { status: "stopped" as const, startHour: 12, duration: 1 },
      { status: "running" as const, startHour: 13, duration: 11 },
    ],
    currentJob: {
      jobNumber: "JO-2023-001",
      startDate: "2024-01-23",
      metrics: {
        totalParts: 1500,
        completedParts: 385,
        scrap: 0,
        completionPercentage: 25.6,
        cycleTime: {
          actual: 4.6,
          target: 4.2,
        },
        utilization: {
          actual: 78,
          target: 85,
        },
      },
      hoursRemaining: 68.5,
      projectedEnd: "2024-01-25",
      targetEnd: "2024-01-26",
    },
    weeklySchedule: weeklyScheduleData,
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
    operator: "Sarah Wilson",
    metrics: {
      goodParts: 306,
      scrap: 0,
      utilization: 82,
      cycleTime: 4.2,
      quality: 99.9,
      oee: 81.91,
    },
    timeline: [
      { status: "running" as const, startHour: 0, duration: 8 },
      { status: "stopped" as const, startHour: 8, duration: 1 },
      { status: "running" as const, startHour: 9, duration: 15 },
    ],
    currentJob: {
      jobNumber: "JO-2023-002",
      startDate: "2024-01-23",
      metrics: {
        totalParts: 1200,
        completedParts: 306,
        scrap: 0,
        completionPercentage: 25.5,
        cycleTime: {
          actual: 4.2,
          target: 4.0,
        },
        utilization: {
          actual: 82,
          target: 85,
        },
      },
      hoursRemaining: 58.5,
      projectedEnd: "2024-01-25",
      targetEnd: "2024-01-26",
    },
    weeklySchedule: weeklyScheduleData,
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
    operator: "David Chen",
    metrics: {
      goodParts: 196,
      scrap: 0,
      utilization: 85,
      cycleTime: 3.8,
      quality: 99.7,
      oee: 84.74,
    },
    timeline: [
      { status: "running" as const, startHour: 0, duration: 9 },
      { status: "maintenance" as const, startHour: 9, duration: 1 },
      { status: "running" as const, startHour: 10, duration: 14 },
    ],
    currentJob: {
      jobNumber: "JO-2023-003",
      startDate: "2024-01-23",
      metrics: {
        totalParts: 800,
        completedParts: 196,
        scrap: 0,
        completionPercentage: 24.5,
        cycleTime: {
          actual: 3.8,
          target: 3.6,
        },
        utilization: {
          actual: 85,
          target: 85,
        },
      },
      hoursRemaining: 48.5,
      projectedEnd: "2024-01-25",
      targetEnd: "2024-01-25",
    },
    weeklySchedule: weeklyScheduleData,
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
    operator: "Jane Doe",
    metrics: {
      goodParts: 650,
      scrap: 12,
      utilization: 77,
      cycleTime: 2.8,
      quality: 98.2,
      oee: 75.5,
    },
    timeline: [
      { status: "running" as const, startHour: 0, duration: 7 },
      { status: "stopped" as const, startHour: 7, duration: 1 },
      { status: "running" as const, startHour: 8, duration: 16 },
    ],
    currentJob: {
      jobNumber: "JO-2023-004",
      startDate: "2024-01-23",
      metrics: {
        totalParts: 5000,
        completedParts: 650,
        scrap: 12,
        completionPercentage: 13,
        cycleTime: {
          actual: 2.8,
          target: 2.6,
        },
        utilization: {
          actual: 77,
          target: 85,
        },
      },
      hoursRemaining: 82.5,
      projectedEnd: "2024-01-26",
      targetEnd: "2024-01-26",
    },
    weeklySchedule: weeklyScheduleData,
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
    operator: "Tom Anderson",
    metrics: {
      goodParts: 100,
      scrap: 1,
      utilization: 92,
      cycleTime: 18,
      quality: 99.0,
      oee: 91.08,
    },
    timeline: [
      { status: "running" as const, startHour: 0, duration: 9 },
      { status: "maintenance" as const, startHour: 9, duration: 1 },
      { status: "running" as const, startHour: 10, duration: 14 },
    ],
    currentJob: {
      jobNumber: "JO-2023-005",
      startDate: "2024-01-23",
      metrics: {
        totalParts: 400,
        completedParts: 100,
        scrap: 1,
        completionPercentage: 25,
        cycleTime: {
          actual: 18,
          target: 18,
        },
        utilization: {
          actual: 92,
          target: 85,
        },
      },
      hoursRemaining: 72,
      projectedEnd: "2024-01-26",
      targetEnd: "2024-01-26",
    },
    weeklySchedule: weeklyScheduleData,
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
    operator: "Maria Garcia",
    metrics: {
      goodParts: 100,
      scrap: 2,
      utilization: 88,
      cycleTime: 18,
      quality: 98.0,
      oee: 86.24,
    },
    timeline: [
      { status: "running" as const, startHour: 0, duration: 8 },
      { status: "stopped" as const, startHour: 8, duration: 1 },
      { status: "running" as const, startHour: 9, duration: 15 },
    ],
    currentJob: {
      jobNumber: "JO-2023-006",
      startDate: "2024-01-23",
      metrics: {
        totalParts: 800,
        completedParts: 100,
        scrap: 2,
        completionPercentage: 12.5,
        cycleTime: {
          actual: 18,
          target: 18,
        },
        utilization: {
          actual: 88,
          target: 85,
        },
      },
      hoursRemaining: 84,
      projectedEnd: "2024-01-26",
      targetEnd: "2024-01-26",
    },
    weeklySchedule: weeklyScheduleData,
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
    operator: "Mike Johnson",
    metrics: {
      goodParts: 500,
      scrap: 15,
      utilization: 74,
      cycleTime: 3.6,
      quality: 97.1,
      oee: 71.8,
    },
    timeline: [
      { status: "running" as const, startHour: 0, duration: 5 },
      { status: "maintenance" as const, startHour: 5, duration: 3 },
      { status: "running" as const, startHour: 8, duration: 16 },
    ],
    currentJob: {
      jobNumber: "JO-2023-007",
      startDate: "2024-01-23",
      metrics: {
        totalParts: 2000,
        completedParts: 500,
        scrap: 15,
        completionPercentage: 25,
        cycleTime: {
          actual: 3.6,
          target: 3.4,
        },
        utilization: {
          actual: 74,
          target: 85,
        },
      },
      hoursRemaining: 60,
      projectedEnd: "2024-01-25",
      targetEnd: "2024-01-25",
    },
    weeklySchedule: weeklyScheduleData,
  },
];

export default function MachineDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const productionLine = productionLineData.find((line) => line.id === id);

  if (!productionLine) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <MachineHeader
        machineName={productionLine.name}
        status={
          productionLine.status === "active"
            ? "running"
            : productionLine.status === "maintenance"
              ? "maintenance"
              : "stopped"
        }
        onBack={() => window.history.back()}
      />

      <div className="space-y-6 p-4">
        <HourTimeline segments={productionLine.timeline} />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <CurrentPart
              partName={productionLine.currentJob.jobNumber}
              partNumber={productionLine.current_item_id || ""}
            />
          </div>

          <div className="col-span-6">
            <JobOverview
              jobNumber={productionLine.currentJob.jobNumber}
              startDate={productionLine.currentJob.startDate}
              metrics={productionLine.currentJob.metrics}
            />
          </div>

          <div className="col-span-3">
            <GoalForecast
              hoursRemaining={productionLine.currentJob.hoursRemaining}
              projectedEnd={productionLine.currentJob.projectedEnd}
              targetEnd={productionLine.currentJob.targetEnd}
            />
          </div>
        </div>

        <WeeklySchedule schedule={productionLine.weeklySchedule} />
      </div>
    </div>
  );
}
