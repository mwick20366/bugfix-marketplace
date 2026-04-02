import { z } from "zod"

export const editBugSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tech_stack: z.string().min(1, "Tech stack is required"),
  repo_link: z.string().url("Repo link must be a valid URL"),
  bounty: z.number().min(1),
})

export type EditBugSchema = z.infer<typeof editBugSchema>
