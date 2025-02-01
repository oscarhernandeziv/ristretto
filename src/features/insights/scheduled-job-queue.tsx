import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Job {
  id: string;
  partNumber: string;
  partName: string;
  quantity: number;
  startTime: string;
  endTime: string;
}

interface ScheduledJobQueueProps {
  jobs: Job[];
}

export function ScheduledJobQueue({ jobs }: ScheduledJobQueueProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Scheduled Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Number</TableHead>
              <TableHead>Part Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.partNumber}</TableCell>
                <TableCell>{job.partName}</TableCell>
                <TableCell>{job.quantity}</TableCell>
                <TableCell>{job.startTime}</TableCell>
                <TableCell>{job.endTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
