import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface ScheduleEntry {
  partNumber: string;
  partName: string;
  targetQuantity: number;
  actualQuantity?: number;
  status: "completed" | "in-progress" | "scheduled";
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  date: string;
  entries: ScheduleEntry[];
}

interface WeeklyScheduleProps {
  schedule: DaySchedule[];
}

export function WeeklySchedule({ schedule }: WeeklyScheduleProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
      case "in-progress":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
      case "scheduled":
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {schedule.map((day, dayIndex) => (
            <div key={dayIndex} className="space-y-2">
              <div className="text-center">
                <div className="font-medium">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="space-y-2">
                {day.entries.map((entry, entryIndex) => (
                  <div
                    key={entryIndex}
                    className={cn(
                      "rounded-r-md border-l-4 p-2 text-sm",
                      getStatusColor(entry.status)
                    )}
                  >
                    <div className="truncate font-medium">{entry.partName}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {entry.partNumber}
                    </div>
                    <div className="mt-1 text-xs">
                      {entry.startTime} - {entry.endTime}
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span>Target: {entry.targetQuantity}</span>
                      {entry.actualQuantity !== undefined && (
                        <span>Actual: {entry.actualQuantity}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
