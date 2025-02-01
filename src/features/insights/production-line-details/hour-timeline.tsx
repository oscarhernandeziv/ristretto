"use client";

interface TimelineSegment {
  status: "running" | "stopped" | "maintenance";
  startHour: number;
  duration: number;
}

interface HourTimelineProps {
  segments: TimelineSegment[];
}

export function HourTimeline({ segments }: HourTimelineProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "maintenance":
        return "bg-yellow-500";
      case "stopped":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full">
      <div className="flex">
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex-1 text-center text-sm text-muted-foreground"
          >
            {hour.toString().padStart(2, "0")}
          </div>
        ))}
      </div>
      <div className="mt-1 h-6 w-full rounded-md bg-muted">
        <div className="flex h-full">
          {segments.map((segment, index) => (
            <div
              key={index}
              className={`${getStatusColor(segment.status)}`}
              style={{
                width: `${(segment.duration / 24) * 100}%`,
                marginLeft: `${(segment.startHour / 24) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
