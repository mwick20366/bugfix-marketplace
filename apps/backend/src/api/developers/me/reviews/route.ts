import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const developerId = req.auth_context?.actor_id

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: reviews } = await query.graph({
    entity: "developer_review",
    fields: [
      "id",
      "rating",
      "notes",
      "client.*",
      "submission.*",
      "created_at",
    ],
    filters: {
      developer_id: developerId,
    },
  })

  res.json({ reviews })
}