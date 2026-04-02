import { z } from "zod"

export const approveRejectSubmissionSchema = z.object({
  notes: z.string().optional(),
})

export type ApproveRejectSubmissionSchema = z.infer<typeof approveRejectSubmissionSchema>
