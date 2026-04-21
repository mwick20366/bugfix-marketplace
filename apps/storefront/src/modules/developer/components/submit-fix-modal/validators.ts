import { z } from "zod"

export const submitFixSchema = z.object({
  notes: z.string().min(1, "Notes are required"),
  file_url: z.string().url("File URL must be a valid URL"),
})

export type SubmitFixSchema = z.infer<typeof submitFixSchema>
