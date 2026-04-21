import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { createDeveloperReviewWorkflow } from "../../workflows/developer-review"

export const PostDeveloperReviewSchema = z.object({
  rating: z.preprocess(
    (val) => (typeof val === "string" ? parseInt(val) : val),
    z.number().min(1).max(5)
  ),
  notes: z.string().optional(),
  developer_id: z.string(),
  submission_id: z.string(),
})

type PostDeveloperReviewReq = z.infer<typeof PostDeveloperReviewSchema>

export const POST = async (
  req: AuthenticatedMedusaRequest<PostDeveloperReviewReq>,
  res: MedusaResponse
) => {
  const client_id = req.auth_context?.actor_id
  const input = req.validatedBody

  console.log("Received request to create developer review with input:", input)
  console.log("Authenticated client ID:", client_id)

  const { result } = await createDeveloperReviewWorkflow(req.scope).run({
    input: {
      ...input,
      client_id,
    },
  })

  res.json(result)
}