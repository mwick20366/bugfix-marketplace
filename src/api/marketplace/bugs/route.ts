// src/api/marketplace/bugs/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    q,
    difficulty,
  } = req.validatedQuery as {
    q?: string,
    difficulty?: string | string[],
  }

  const difficultyFilter = difficulty
    ? Array.isArray(difficulty) ? difficulty : [difficulty]
    : undefined

  const {
    data: bugs,
    metadata: { count, take, skip } = {},
  } = await query.graph({
    entity: "bug",
    ...req.queryConfig,
    // @ts-ignore
    filters: {
      status: "open",
      ...(q && {
        $or: [
          { title: { $ilike: `%${q}%` } },
          { description: { $ilike: `%${q}%` } },
          { tech_stack: { $ilike: `%${q}%` } },
        ],
      }),
      ...(difficultyFilter ? { difficulty: difficultyFilter } : {}), 
    },
  })

  res.json({
    bugs,
    count,
    limit: take,
    offset: skip,
  })
}