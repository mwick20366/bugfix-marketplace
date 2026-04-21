import { z } from "@medusajs/framework/zod"

export const MarkMessagesReadSchema = z.object({
  reader_type: z.enum(["client", "developer"]),
})