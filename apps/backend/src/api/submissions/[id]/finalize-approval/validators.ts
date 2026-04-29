import { z } from "@medusajs/framework/zod"

export const PostCaptureSubmissionSchema = z.object({
  payment_collection_id: z.string(),
  client_notes: z.string().optional(),
})
