// src/api/store/submissions/[id]/reject/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { rejectSubmissionWorkflow, RejectSubmissionWorkflowInput } from "../../../../workflows/submission"

export const POST = async (
  req: AuthenticatedMedusaRequest<RejectSubmissionWorkflowInput>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const currentClientId = req.auth_context?.actor_id
  const submissionId = req.params.id

  // @ts-ignore
  const { data: [submission] } = await query.graph({
    entity: "submission",
    fields: ["id", "status", "notes", "file_url", "bug.*", "bug.client.*"],
    filters: { id: submissionId },
  }, { throwIfKeyNotFound: true })

  // Only the client who owns the bug can reject
  if (submission.bug?.client?.id !== currentClientId) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You are not authorized to reject this submission"
    )
  }

  // Submission must be in a reviewable state
  if (submission.status !== "awaiting client review") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "This submission is not awaiting client review"
    )
  }

  // Execute reject workflow
  const { result } = await rejectSubmissionWorkflow(req.scope).run({
    input: {
      submission: {
        submissionId: req.params.id,
        client_notes: req.body.submission.client_notes,
      }
    },
  })

  res.json({ submission: result })
}