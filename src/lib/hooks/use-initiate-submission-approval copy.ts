"use client"
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query"
import { initiateSubmissionApproval } from "@lib/data/submissions"
import { InitiateSubmissionSchema } from "@modules/client/components/submission-details-modal/validators"

export const useInitiateSubmissionApproval = (submissionId: string, options?: UseMutationOptions<any, any, InitiateSubmissionSchema>) => {
  return useMutation({
    mutationFn: () => {
      return initiateSubmissionApproval(submissionId)
    },
    onSuccess: (data: any, variables: any, context: any, meta: any) => {
      options?.onSuccess?.(data, variables, context, meta)
    },
    ...options,
  })
}
