// src/api/client/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { createClientWorkflow, CreateClientWorkflowInput } from "../../workflows/client"

type RequestBody = {
  contact_first_name: string
  contact_last_name: string
  company_name?: string
  email: string
  avatar_url?: string
}

export async function POST(
  req: AuthenticatedMedusaRequest<RequestBody>,
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
      client: { ...req.body },
      authIdentityId: req.auth_context.auth_identity_id,
    },
  })

  res.status(200).json({ client: result })
}
