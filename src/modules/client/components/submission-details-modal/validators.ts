import { z } from "zod"

export const initiateSubmissionApprovalSchema = z.object({
  // No fields needed for initiation, but schema can be extended in the future if necessary
})

export const finalizeSubmissionSchema = z.object({
  client_notes: z.string().optional(),
  paymentId: z.string().optional(),
})

export const rejectSubmissionSchema = z.object({
  client_notes: z.string().optional(),
})

export type InitiateSubmissionSchema = z.infer<typeof initiateSubmissionApprovalSchema>
export type FinalizeSubmissionSchema = z.infer<typeof finalizeSubmissionSchema>
export type RejectSubmissionSchema = z.infer<typeof rejectSubmissionSchema>