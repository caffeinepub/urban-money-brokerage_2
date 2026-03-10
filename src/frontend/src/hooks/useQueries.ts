import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Record_ } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<Record_[]>({
    queryKey: ["records"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      brokerageAmountReceivedDate: string | null;
      bankAmountReceivedDate: string | null;
      finance: string;
      customerName: string;
      mcf: string;
      product: string;
      loanAmount: string;
      grossAmount: string;
      netAmount: string;
      remark: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addRecord(
        data.brokerageAmountReceivedDate,
        data.bankAmountReceivedDate,
        data.finance,
        data.customerName,
        data.mcf,
        data.product,
        data.loanAmount,
        data.grossAmount,
        data.netAmount,
        data.remark,
        BigInt(Date.now()),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}

export function useUpdateRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      brokerageAmountReceivedDate: string | null;
      bankAmountReceivedDate: string | null;
      finance: string;
      customerName: string;
      mcf: string;
      product: string;
      loanAmount: string;
      grossAmount: string;
      netAmount: string;
      remark: string;
      createdAt: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateRecord(
        data.id,
        data.brokerageAmountReceivedDate,
        data.bankAmountReceivedDate,
        data.finance,
        data.customerName,
        data.mcf,
        data.product,
        data.loanAmount,
        data.grossAmount,
        data.netAmount,
        data.remark,
        data.createdAt,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}

export function useDeleteRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteRecord(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
    },
  });
}
