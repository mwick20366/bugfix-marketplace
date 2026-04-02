// src/api/client/me/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  const clientId = req.auth_context?.actor_id

  const { data: [client] } = await query.graph({
    entity: "client",
    fields: [
          "*",
          "bugs.*",
          "bugs.developer.*",
          "bugs.submissions.*",
        ],
    filters: {
      id: clientId,
    },
  }, {
    throwIfKeyNotFound: true,
  })

  res.json({ client })
}