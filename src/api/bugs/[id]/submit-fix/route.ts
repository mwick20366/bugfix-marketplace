// src/api/bugs/[id]/claim/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { submitBugFixWorkflow, SubmitBugFixWorkflowInput } from "../../../../workflows/bug"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

export async function POST(
  req: AuthenticatedMedusaRequest<SubmitBugFixWorkflowInput>,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const currentUserId = req.auth_context?.actor_id
  const bugId = req.params.id

  console.log("bugId:", bugId)
  console.log("request body:", req.body)
  
  // Fetch the bug to check who claimed it
  // @ts-ignore
  const { data: [bug] } = await query.graph({
    entity: "bug",
    fields: ["id", "status", "developer.id"],
    filters: { id: bugId },
  }, { throwIfKeyNotFound: true })

  // Ensure the current developer is the one who claimed the bug
  if (bug.developer?.id !== currentUserId) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You are not authorized to submit a fix for this bug"
    )
  }

  console.log("Bug found for fix submission:", bug)

  // Ensure the bug has a status of 'claimed'
  if (bug.status !== "claimed") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "A fix can only be submitted for bugs with a status of 'claimed'"
    )
  }

  const { result } = await submitBugFixWorkflow(req.scope).run({
    input: {
      submission: {
        bug_id: req.params.id,
        developer_id: req.auth_context.actor_id,
        notes: req.body.submission.notes,
        fileUrl: req.body.submission.fileUrl,
      },
    },
  })

  res.json({ submission: result })
}