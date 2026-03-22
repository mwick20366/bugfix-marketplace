// src/api/developer/me/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker"
import { ConsoleSpanExporter } from "@medusajs/framework/opentelemetry/sdk-trace-node"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  const developerId = req.auth_context?.actor_id

  const { data: [developer] } = await query.graph({
    entity: "developer",
    fields: ["*"],
    filters: {
      id: developerId,
    },
  }, {
    throwIfKeyNotFound: true,
  })

  console.log("Developer found:", developer)
  res.json({ developer })
}