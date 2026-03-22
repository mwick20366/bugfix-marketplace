import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  updateBugWorkflow,
  deleteBugWorkflow,
  UpdateBugWorkflowInput,
  DeleteBugWorkflowInput
} from "../../../workflows/bug"

// GET /bugs/:id - get a bug
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve("query")
  const bugId = req.params.id

  const { data: [bug] } = await query.graph({
    entity: "bug",
    fields: ["*"],
    filters: {
      id: bugId,
    },
  }, {
    throwIfKeyNotFound: true,
  })

  console.log("Bug found:", bug)
  res.json({ bug })
}

// POST /bugs/:id — update a bug
export async function POST(
    req: MedusaRequest<UpdateBugWorkflowInput>,
    res: MedusaResponse
) {
  const { result } = await updateBugWorkflow(req.scope).run({
    input: {
        bug: {
            id: req.params.id,
            ...req.body
        }
    } as UpdateBugWorkflowInput
  })

  res.json({ bug: result })
}

// DELETE /bugs/:id — delete a bug
export async function DELETE(
    req: MedusaRequest<DeleteBugWorkflowInput>,
    res: MedusaResponse
) {
  await deleteBugWorkflow(req.scope).run({
    input: {
      bug: {
        id: req.params.id,
      },
    },
  })

  res.json({ success: true })
}