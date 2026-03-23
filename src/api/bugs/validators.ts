import { z } from "@medusajs/framework/zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetBugsSchema = createFindParams().merge(
  z.object({
    q: z.string().optional(),
    status: z.string().optional(),
  })
)

export const PostCreateBugSchema = z.object({
  title: z.string(),
  description: z.string(),
  techStack: z.string(),
  repoLink: z.string(),
  bounty: z.number(),
  client_id: z.string(),
})