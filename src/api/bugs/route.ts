import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { PostCreateBugSchema } from "./validators"
import { createBugWorkflow } from "../../workflows/bug"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import developer from "../../modules/bugtracker/models/developer"

type CreateBugBody = z.infer<typeof PostCreateBugSchema>

// GET /bugs
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    q,
    status,
    developer_id,
    client_id,
  } = req.validatedQuery as {
    q?: string,
    status?: string,
    developer_id?: string,
    client_id?: string
  }

  const isAdmin = req.auth_context?.actor_type === "user"
  const currentUserId = req.auth_context?.actor_id

  let developerId: string | undefined = developer_id
  let clientId: string | undefined = client_id

  if (!isAdmin) {
    if (developerId && req.auth_context?.actor_type === "developer") {
      developerId = currentUserId
    } else if (clientId && req.auth_context?.actor_type === "client") {
      clientId = currentUserId
    }
  }

  const {
    data: bugs,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "bug",
    ...req.queryConfig,
    // @ts-ignore
    filters: {
      ...(q && {
        $or: [
          { title: { $ilike: `%${q}%` } },
          { description: { $ilike: `%${q}%` } },
          { techStack: { $ilike: `%${q}%` } },
        ],
      }),
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
        client: {
          id: clientId
        }
      }),
    },
  })

  res.json({ bugs, count, limit: take, offset: skip })
}

// POST /bugs
export const POST = async (
  req: AuthenticatedMedusaRequest<CreateBugBody>,
  res: MedusaResponse
) => {
  const { result } = await createBugWorkflow(req.scope).run({
    input: {
        bug: req.validatedBody
    }
  })

  res.json({ bug: result })
}