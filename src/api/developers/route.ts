// src/api/developer/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import createDeveloperWorkflow from "../../workflows/developer/steps/create-developer"

type RequestBody = {
  first_name: string
  last_name: string
  tech_stack?: string
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
      "Request already authenticated as a developer."
    )
  }

  const { result } = await createDeveloperWorkflow(req.scope).run({
    input: {
      developer: { ...req.body },
      authIdentityId: req.auth_context.auth_identity_id,
    },
  })

  res.status(200).json({ developer: result })
}