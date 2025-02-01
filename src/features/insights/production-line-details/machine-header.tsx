import { AlertCircle, FileText, Phone, Settings, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MachineHeaderProps {
  machineName: string;
  status: "running" | "stopped" | "maintenance";
  onBack: () => void;
}

export function MachineHeader({
  machineName,
  status,
  onBack,
}: MachineHeaderProps) {
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
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex items-center gap-2">
          <div className={`h-4 w-4 rounded-full ${getStatusColor(status)}`} />
          <h1 className="text-2xl font-bold">{machineName}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Tally sheets
        </Button>
        <Button variant="outline" size="sm">
          <AlertCircle className="mr-2 h-4 w-4" />
          Downtime
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Setup
        </Button>
        <Button variant="outline" size="sm">
          <Phone className="mr-2 h-4 w-4" />
          Call team
        </Button>
        <Button variant="outline" size="sm">
          <Wrench className="mr-2 h-4 w-4" />
          Maintenance
        </Button>
      </div>
    </div>
  );
}
