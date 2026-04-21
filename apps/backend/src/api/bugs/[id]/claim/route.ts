// src/api/bugs/[id]/claim/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { claimBugWorkflow } from "../../../../workflows/bug"

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { result } = await claimBugWorkflow(req.scope).run({
    input: {
      bug_id: req.params.id,
      developer_id: req.auth_context.actor_id,
    },
  })

  res.json({ bug: result })
}