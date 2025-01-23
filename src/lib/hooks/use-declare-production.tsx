"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { declareProduction } from "@/lib/actions/declare-production";
import { useToast } from "@/lib/hooks/use-toast";

interface UseDeclareProductionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeclareProduction(
  options: UseDeclareProductionOptions = {}
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declareProduction,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Production declared successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["workOrders"] });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      options.onError?.(error);
    },
  });
}
