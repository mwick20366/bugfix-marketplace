"use client"
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query"
import { finalizeSubmissionApproval } from "@lib/data/submissions"
import { FinalizeSubmissionApprovalSchema } from "@modules/client/components/submission-details-modal/validators"

export const useFinalizeSubmissionApproval = 
  (submissionId: string, options?: UseMutationOptions<any, any, FinalizeSubmissionApprovalSchema>) => {
  return useMutation({
    mutationFn: ({ client_notes, payment_id }: FinalizeSubmissionApprovalSchema) => {
      return finalizeSubmissionApproval(submissionId, client_notes, payment_id)
    },
    onSuccess: (data: any, variables: any, context: any, meta: any) => {
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
