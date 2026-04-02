"use client"
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query"
import { approveSubmission } from "@lib/data/submissions"
import { ApproveRejectSubmissionSchema } from "@modules/client/components/submission-details-modal/validators"

export const useApproveSubmission = (submissionId: string, options?: UseMutationOptions<any, any, ApproveRejectSubmissionSchema>) => {
  return useMutation({
    mutationFn: ({ notes }: { notes?: string }) => {
      return approveSubmission(submissionId, notes)
    },
    onSuccess: (data: any, variables: any, context: any, meta: any) => {
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}