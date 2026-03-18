// src/api/client/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import createClientWorkflow from "../../workflows/create-client"

type RequestBody = {
  contactFirstName: string
  contactLastName: string
  companyName: string
  email: string
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
      client: req.body,
      authIdentityId: req.auth_context.auth_identity_id,
    },
  })

  res.status(200).json({ client: result })
}