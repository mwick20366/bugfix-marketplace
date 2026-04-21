import { z } from "@medusajs/framework/zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetMarketplaceBugsSchema = createFindParams().extend({
  q: z.string().optional(),
  difficulty: z.union([z.string(), z.array(z.string())]).optional(),
})
