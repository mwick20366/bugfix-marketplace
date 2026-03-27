import { z } from "@medusajs/framework/zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import develop from "@medusajs/medusa/commands/develop"

export const GetSubmissionsSchema = createFindParams().merge(
  z.object({
    q: z.string().optional(),
    status: z.string().optional(),
    developer_id: z.string().optional(),
    client_id: z.string().optional(),
  })
)

export const PostCreateSubmissionSchema = z.object({
  notes: z.string().optional(),
  fileUrl: z.string().optional(),
  status: z.string().optional(),
  bug_id: z.string(),
  developer_id: z.string().optional(),
})
