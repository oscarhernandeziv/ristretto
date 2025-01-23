import { useMutation, useQueryClient } from "@tanstack/react-query";

import { startWorkOrder } from "@/lib/actions/start-work-order";
import type { WorkOrder } from "@/lib/queries/work-order";

interface StartWorkOrderParams {
  workOrderId: string;
  productionLineId: string;
}

export function useStartWorkOrder({
  onError,
}: {
  onError: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workOrderId,
      productionLineId,
    }: StartWorkOrderParams) => {
      const response = await startWorkOrder(workOrderId, productionLineId);
      if (response.error) throw new Error(response.error);
      return response.data as WorkOrder;
    },
    onMutate: async ({ workOrderId, productionLineId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["workOrders", productionLineId],
      });

      // Snapshot previous value
      const previousWorkOrders = queryClient.getQueryData([
        "workOrders",
        productionLineId,
      ]);

      // Optimistically update work order status
      queryClient.setQueryData(
        ["workOrders", productionLineId],
        (old: WorkOrder[] | undefined) => {
          if (!old) return old;
          return old.map((order) =>
            order.id === workOrderId
              ? {
                  ...order,
                  status: "started",
                  actual_start_time: new Date().toISOString(),
                }
              : order
          );
        }
      );

      return { previousWorkOrders };
    },
    onError: (error: Error, _, context) => {
      // Revert optimistic update on error
      if (context?.previousWorkOrders) {
        queryClient.setQueryData(["workOrders"], context.previousWorkOrders);
      }
      onError(error);
    },
    onSettled: (_, __, { productionLineId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: ["workOrders", productionLineId],
      });
    },
  });
}
