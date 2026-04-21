import { z } from "@medusajs/framework/zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetBugsSchema = createFindParams().merge(
  z.object({
    q: z.string().optional(),
    status: z.union([z.string(), z.array(z.string())]).optional(),
    difficulty: z.union([z.string(), z.array(z.string())]).optional(),
    developer_id: z.string().optional(),
    client_id: z.string().optional(),
    tech_stack: z.union([z.string(), z.array(z.string())]).optional(),
  })
)

export const PostCreateBugSchema = z.object({
  title: z.string(),
  description: z.string(),
  tech_stack: z.string(),
  repo_link: z.string(),
  bounty: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  client_id: z.string(),
})

export const SubmitBugFixSchema = z.object({
  submission: z.object({
    notes: z.string().optional(),
    file_url: z.string().optional(),
  }),
})