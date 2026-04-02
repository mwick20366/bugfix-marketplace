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
    status?: string,
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

  // console.log("Authenticated user:", {
  //   actorId: req.auth_context?.actor_id,
  //   actorType: req.auth_context?.actor_type,
  // })

  console.log("Querying submissions with filters:", {
    q,
    status,
    developerId,
    clientId,
  })

  const {
    data: submissions,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "submission",
    ...req.queryConfig,
    // @ts-ignore
    filters: {
      // ...(q && {
      //   $or: [
      //     { title: { $ilike: `%${q}%` } },
      //     { description: { $ilike: `%${q}%` } },
      //     { tech_stack: { $ilike: `%${q}%` } },
      //   ],
      // }),
      ...(status && {
        status: { $ilike: status }
      }),
      ...(developerId && {
        developer: {
          id: developerId
        }
      }
    ),
      ...(clientId && {
        bug: {
          client: {
            id: clientId
          }
        }
        // client: {
        //   id: clientId
        // }
      }),
    },
  })

  // console.log("Fetched submissions:", submissions)
  // console.log("Count:", count, "Take:", take, "Skip:", skip)
  
  res.json({ submissions, count, limit: take, offset: skip })
}
