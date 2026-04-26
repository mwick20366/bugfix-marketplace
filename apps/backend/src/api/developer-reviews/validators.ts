import { z } from "@medusajs/framework/zod"

export const PostDeveloperReviewSchema = z.object({
  rating: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val) : val),
    z.number().min(1).max(5)
  ),
  notes: z.string().optional(),
  developer_id: z.string(),
  submission_id: z.string(),
})
