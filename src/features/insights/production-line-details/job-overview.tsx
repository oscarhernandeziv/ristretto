import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobOverviewProps {
  jobNumber: string;
  startDate: string;
  metrics: {
    totalParts: number;
    completedParts: number;
    scrap: number;
    completionPercentage: number;
    cycleTime: {
      actual: number;
      target: number;
    };
    utilization: {
      actual: number;
      target: number;
    };
  };
}

export function JobOverview({ startDate, metrics }: JobOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>JOB OVERVIEW</CardTitle>
          <div className="text-sm text-muted-foreground">
            PRODUCTION STARTED: {startDate}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold">{metrics.totalParts}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              TOTAL PARTS
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold">
              {metrics.scrap}/{metrics.totalParts}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              TOTAL SCRAP
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold">
              {metrics.completionPercentage}%
            </div>
            <div className="mt-1 text-sm text-muted-foreground">COMPLETE</div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Parts</div>
            <div className="text-right">{metrics.completedParts}</div>
            <div className="text-right text-muted-foreground">
              {metrics.totalParts}
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">Cycle Time</div>
            <div className="text-right">{metrics.cycleTime.actual}</div>
            <div className="text-right text-muted-foreground">
              {metrics.cycleTime.target}
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <div className="font-medium">UTZ</div>
            <div className="text-right">{metrics.utilization.actual}%</div>
            <div className="text-right text-muted-foreground">
              {metrics.utilization.target}%
            </div>
          </div>
        </div>

        <Button variant="outline" className="mt-6 w-full">
          <Edit className="mr-2 h-4 w-4" />
          EDIT JOB OVERVIEW
        </Button>
      </CardContent>
    </Card>
  );
}
