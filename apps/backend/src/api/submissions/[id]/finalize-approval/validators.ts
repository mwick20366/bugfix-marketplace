import { z } from "@medusajs/framework/zod"

export const PostCaptureSubmissionSchema = z.object({
  payment_method_id: z.string(),
  client_notes: z.string().optional(),
})
