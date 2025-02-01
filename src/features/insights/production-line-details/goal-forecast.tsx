import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GoalForecastProps {
  hoursRemaining: number;
  projectedEnd: string;
  targetEnd: string;
}

export function GoalForecast({
  hoursRemaining,
  projectedEnd,
  targetEnd,
}: GoalForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GOAL FORECAST</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-5xl font-bold">{hoursRemaining}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            HOURS REMAINING
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <div className="text-2xl font-bold text-green-500">
              {projectedEnd}
            </div>
            <div className="text-sm text-muted-foreground">PROJECTED END</div>
          </div>
          <div>
            <div className="text-lg">{targetEnd}</div>
            <div className="text-sm text-muted-foreground">TARGET END</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
