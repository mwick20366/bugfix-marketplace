// src/api/store/bugs/[id]/messages/validators.ts
import { z } from "@medusajs/framework/zod"

export const PostMessageSchema = z.object({
  content: z.string().min(1),
})