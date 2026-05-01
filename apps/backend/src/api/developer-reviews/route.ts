import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { createDeveloperReviewWorkflow } from "../../workflows/developer-review"
import { PostDeveloperReviewSchema } from "./validators"

type PostDeveloperReviewReq = z.infer<typeof PostDeveloperReviewSchema>

export const POST = async (
  req: AuthenticatedMedusaRequest<PostDeveloperReviewReq>,
  res: MedusaResponse
) => {
  const client_id = req.auth_context?.actor_id
  const input = req.validatedBody

  const { result } = await createDeveloperReviewWorkflow(req.scope).run({
    input: {
      ...input,
      client_id,
    },
  })

  res.json(result)
}