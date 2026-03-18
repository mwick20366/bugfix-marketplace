// src/api/developer/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import createDeveloperWorkflow from "../../workflows/create-developer"

type RequestBody = {
  firstName: string
  lastName: string
  email: string
}

export async function POST(
  req: AuthenticatedMedusaRequest<RequestBody>,
  res: MedusaResponse
) {
  if (req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Request already authenticated as a developer."
    )
  }

  const { result } = await createDeveloperWorkflow(req.scope).run({
    input: {
      developer: req.body,
      authIdentityId: req.auth_context.auth_identity_id,
    },
  })

  res.status(200).json({ developer: result })
}