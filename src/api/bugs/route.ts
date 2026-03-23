import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { PostCreateBugSchema } from "./validators"
import { createBugWorkflow } from "../../workflows/bug"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type CreateBugBody = z.infer<typeof PostCreateBugSchema>

// GET /bugs
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { q, status } = req.validatedQuery as { q?: string, status?: string }

  const {
    data: bugs,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "bug",
    ...req.queryConfig,
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
    },
  })

  res.json({ bugs, count, limit: take, offset: skip })
}

// POST /bugs
export const POST = async (
  req: AuthenticatedMedusaRequest<CreateBugBody>,
  res: MedusaResponse
) => {
  console.log('validated body', req.validatedBody);

  const { result } = await createBugWorkflow(req.scope).run({
    input: {
        bug: req.validatedBody
    }
  })

  res.json({ bug: result })
}