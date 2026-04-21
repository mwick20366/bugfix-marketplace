import { z } from "@medusajs/framework/zod"

export const PostDeveloperSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  tech_stack: z.string().optional(),
  avatar_url: z.string().url().optional(),
})