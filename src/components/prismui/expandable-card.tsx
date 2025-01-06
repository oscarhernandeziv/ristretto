"use client";

import { useEffect, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Settings,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useExpandable } from "@/lib/hooks/use-expandable";

interface WorkOrderStatusCardProps {
  workOrderNumber: string;
  productName: string;
  progress: number;
  dueDate: string;
  operators: Array<{ name: string; image?: string }>;
  tasks: Array<{ title: string; completed: boolean }>;
  quantity: number;
  qualityIssues: number;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "on_hold";
}

export function WorkOrderStatusCard({
  workOrderNumber,
  productName,
  progress,
  dueDate,
  operators,
  tasks,
  quantity,
  qualityIssues,
  priority,
  status,
}: WorkOrderStatusCardProps) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "in_progress":
        return "bg-blue-100 text-blue-600";
      case "on_hold":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card
      className="w-full max-w-xl cursor-pointer overflow-x-hidden transition-all duration-300 hover:shadow-lg"
      onClick={toggleExpand}
    >
      <CardHeader className="space-y-1">
        <div className="flex w-full items-start justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className={getStatusColor(status)}>
              {status.replace("_", " ").toUpperCase()}
            </Badge>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">WO-{workOrderNumber}</h3>
              <p className="text-sm text-gray-600">
                {productName} • {quantity} units
              </p>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className={`h-8 w-8 ${getPriorityColor(priority)}`}
                >
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{priority.toUpperCase()} Priority</p>
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
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} className="h-2" />
          </div>

          <motion.div
            style={{ height: animatedHeight }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div ref={contentRef}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 pt-2"
                  >
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Due {dueDate}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <AlertCircle className="mr-1 h-4 w-4 text-red-500" />
                          <span>{qualityIssues} issues</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center text-sm font-medium">
                        <Users className="mr-2 h-4 w-4" />
                        Operators
                      </h4>
                      <div className="flex -space-x-2">
                        {operators.map((operator, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="border-2 border-white">
                                  <AvatarImage
                                    src={
                                      operator.image ||
                                      `/placeholder.svg?height=32&width=32&text=${operator.name[0]}`
                                    }
                                    alt={operator.name}
                                  />
                                  <AvatarFallback>
                                    {operator.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{operator.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Production Tasks</h4>
                      {tasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm"
                        >
                          <span
                            className={`text-gray-600 ${task.completed ? "line-through" : ""}`}
                          >
                            {task.title}
                          </span>
                          {task.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-between text-sm text-gray-600">
          <span>Last updated: 2 hours ago</span>
          <div className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Machine #123</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
