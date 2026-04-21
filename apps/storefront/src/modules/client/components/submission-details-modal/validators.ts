import { z } from "zod"

export const initiateSubmissionApprovalSchema = z.object({
  // No fields needed for initiation, but schema can be extended in the future if necessary
})

export const finalizeSubmissionApprovalSchema = z.object({
  client_notes: z.string().optional(),
  payment_collection_id: z.string().optional(),
})

export const rejectSubmissionSchema = z.object({
  client_notes: z.string().optional(),
})

export type InitiateSubmissionApprovalSchema = z.infer<typeof initiateSubmissionApprovalSchema>
export type FinalizeSubmissionApprovalSchema = z.infer<typeof finalizeSubmissionApprovalSchema>
export type RejectSubmissionSchema = z.infer<typeof rejectSubmissionSchema>