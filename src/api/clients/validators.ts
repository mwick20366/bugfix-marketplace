import { z } from "@medusajs/framework/zod"

export const PostClientSchema = z.object({
  contact_first_name: z.string(),
  contact_last_name: z.string(),
  company_name: z.string().optional(),
  email: z.string().email(),
  avatar_url: z.string().url().optional(),
})