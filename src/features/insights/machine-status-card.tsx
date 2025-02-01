import { AlertCircle, Clock, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MachineStatusCardProps {
  machineId: string;
  status: "running" | "stopped" | "maintenance";
  operator: string;
  metrics: {
    goodParts: number;
    scrap: number;
    utilization: number;
    cycleTime: number;
    quality: number;
    oee: number;
  };
  timeline: Array<{
    status: "running" | "stopped" | "maintenance";
    duration: number;
  }>;
  currentJob?: string;
  issue?: string;
}

export function MachineStatusCard({
  machineId,
  status,
  operator,
  metrics,
  currentJob,
  issue,
}: MachineStatusCardProps) {
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
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex w-full items-start justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className={getStatusColor(status)}>
              {status.replace("_", " ").toUpperCase()}
            </Badge>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">{machineId}</h3>
              <p className="text-sm text-gray-600">
                Current Job: {currentJob || "No active job"}
              </p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className={`h-8 w-8 ${issue ? "text-red-500" : "text-gray-500"}`}
                >
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{issue || "No issues reported"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Production Progress</span>
              <span>{metrics.utilization}%</span>
            </div>
            <Progress value={metrics.utilization} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Good Parts</div>
              <div className="text-xl font-semibold">{metrics.goodParts}</div>
            </div>
            <div>
              <div className="text-gray-600">Scrap</div>
              <div className="text-xl font-semibold">{metrics.scrap}</div>
            </div>
            <div>
              <div className="text-gray-600">OEE</div>
              <div className="text-xl font-semibold">{metrics.oee}%</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Cycle Time: {metrics.cycleTime}s</span>
          </div>

          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/placeholder.svg?height=32&width=32&text=${operator[0]}`}
                alt={operator}
              />
              <AvatarFallback>{operator[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{operator}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-between text-sm text-gray-600">
          <span>Last updated: 2 hours ago</span>
          <div className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>{machineId}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
