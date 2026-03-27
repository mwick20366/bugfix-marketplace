import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
// import { PostCreateBugSchema } from "./validators"
import { createBugWorkflow } from "../../workflows/bug"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import developer from "../../modules/bugtracker/models/developer"

// type CreateSubmissionBody = z.infer<typeof PostCreateSubmissionSchema>

// GET /submissions
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
      //     { techStack: { $ilike: `%${q}%` } },
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
        client: {
          id: clientId
        }
      }),
    },
  })

  res.json({ submissions, count, limit: take, offset: skip })
}

// POST /submissions
// export const POST = async (
//   req: AuthenticatedMedusaRequest<CreateSubmissionBody>,
//   res: MedusaResponse
// ) => {
//   console.log('validated body', req.validatedBody);

//   const { result } = await createBugWorkflow(req.scope).run({
//     input: {
//         bug: req.validatedBody
//     }
//   })

//   res.json({ bug: result })
// }