// src/api/developer/me/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { CLIENT_MODULE } from "../../../modules/client"
import { ConsoleSpanExporter } from "@medusajs/framework/opentelemetry/sdk-trace-node"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  const clientId = req.auth_context?.actor_id

  const { data: [client] } = await query.graph({
    entity: "client",
    fields: ["*"],
    filters: {
      id: clientId,
    },
  }, {
    throwIfKeyNotFound: true,
  })

  console.log("Client found:", client)
  res.json({ client })
}