import { z } from "@medusajs/framework/zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import develop from "@medusajs/medusa/commands/develop"

export const GetBugsSchema = createFindParams().merge(
  z.object({
    q: z.string().optional(),
    status: z.string().optional(),
    developer_id: z.string().optional(),
    client_id: z.string().optional(),
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

export const SubmitBugFixSchema = z.object({
  submission: z.object({
    notes: z.string().optional(),
    fileUrl: z.string().optional(),
  }),
})