"use client"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { rejectSubmission } from "@lib/data/submissions"
import { ApproveRejectSubmissionSchema } from "@modules/client/components/submission-details-modal/validators"

export const useRejectSubmission = (submissionId: string, options?: UseMutationOptions<any, any, ApproveRejectSubmissionSchema>) => {
  return useMutation({
    mutationFn: ({ notes }: { notes?: string }) =>
      rejectSubmission(submissionId, notes),
    onSuccess: (data: any, variables: any, context: any, meta: any) => {
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}