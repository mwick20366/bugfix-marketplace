import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// GET /submissions
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    q,
    status,
  } = req.validatedQuery as {
    q?: string,
    status?: string | string[],
  }

  const isAdmin = req.auth_context?.actor_type === "user"
  const currentUserId = req.auth_context?.actor_id
  const currentUserType = req.auth_context?.actor_type

  let developerId: string | undefined
  let clientId: string | undefined

  if (!isAdmin) {
    if (currentUserType === "developer") {
      developerId = currentUserId
    } else if (currentUserType === "client") {
      clientId = currentUserId
    }
  }

  // Normalize status to an array if present
  const statusFilter = status
    ? Array.isArray(status) ? status : [status]
    : undefined

  const {
    data: submissions,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "submission",
    ...req.queryConfig,
    // @ts-ignore
    filters: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(developerId && {
        developer: {
          id: developerId,
        },
      }),
      ...(clientId && {
        bug: {
          client: {
            id: clientId,
          },
        },
      }),
    },
  })

  res.json({ submissions, count, limit: take, offset: skip })
}