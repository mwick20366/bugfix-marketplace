// src/api/developer/me/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  const developerId = req.auth_context?.actor_id

  const { data: [developer] } = await query.graph({
    entity: "developer",
    fields: ["*", "bugs.*", "submissions.*"],
    filters: {
      id: developerId,
    },
  }, {
    throwIfKeyNotFound: true,
  })

  res.json({ developer })
}