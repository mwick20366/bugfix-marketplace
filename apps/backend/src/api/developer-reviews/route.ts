import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createDeveloperReviewWorkflow } from "../../workflows/developer-review"
import { PostDeveloperReviewSchema } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<typeof PostDeveloperReviewSchema>,
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
      rating: 0,
      developer_id: "",
      submission_id: ""
    },
  })

  res.json(result)
}

export { PostDeveloperReviewSchema }
