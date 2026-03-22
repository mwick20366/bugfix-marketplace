// src/api/bugs/client/[clientId]/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { BUGTRACKER_MODULE } from "../../../../modules/bugtracker"
import BugTrackerModuleService from "../../../../modules/bugtracker/service"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { clientId } = req.params

  // If the actor is a client, ensure they can only see their own bugs
  if (req.auth_context?.actor_id && req.auth_context.actor_id !== clientId) {
    return res.status(403).json({ message: "Unauthorized" })
  }

  const service: BugTrackerModuleService = req.scope.resolve(BUGTRACKER_MODULE)
  const bugs = await service.listBugs({ client_id: clientId })

  res.json({ bugs })
}