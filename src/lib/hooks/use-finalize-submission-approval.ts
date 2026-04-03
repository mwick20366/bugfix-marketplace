"use client"
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query"
import { finalizeSubmissionApproval } from "@lib/data/submissions"
import { FinalizeSubmissionSchema } from "@modules/client/components/submission-details-modal/validators"

export const useFinalizeSubmissionApproval = (submissionId: string, options?: UseMutationOptions<any, any, FinalizeSubmissionSchema>) => {
  return useMutation({
    mutationFn: ({ client_notes, paymentId }: FinalizeSubmissionSchema) => {
      return finalizeSubmissionApproval(submissionId, client_notes, paymentId)
    },
    onSuccess: (data: any, variables: any, context: any, meta: any) => {
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
