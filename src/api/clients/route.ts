// src/api/client/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { createClientWorkflow, CreateClientWorkflowInput } from "../../workflows/client"
import { CreateClientStepInput } from "../../workflows/client/steps/create-client"

// type RequestBody = {
//   contact_first_name: string
//   contact_last_name: string
//   company_name: string
//   email: string
// }

export async function POST(
  req: AuthenticatedMedusaRequest<CreateClientWorkflowInput>,
  res: MedusaResponse
) {
  if (req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Request already authenticated as a client."
    )
  }

  const { result } = await createClientWorkflow(req.scope).run({
    input: {
      ...req.body,
      authIdentityId: req.auth_context.auth_identity_id,
    },
  })

  res.status(200).json({ client: result })
}