// src/api/store/submissions/[id]/finalize-approval/route.ts
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { approveSubmissionWorkflow } from "../../../../workflows/submission"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const currentClientId = req.auth_context?.actor_id
  const submissionId = req.params.id
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // 1. Fetch submission and verify ownership
  const { data: [submission] } = await query.graph({
    entity: "submission",
    fields: ["id", "bug.client.id"],
    filters: { id: submissionId },
  })

  if (submission.bug?.client?.id !== currentClientId) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You are not authorized to approve this submission"
    )
  }

  // 2. Extract the pm_... ID and notes from the storefront
  const { payment_method_id, client_notes } = req.validatedBody as any

  // 3. RUN THE WORKFLOW
  // We remove all the "paymentCollection" and "capturePayment" logic.
  // We simply pass the payment_method_id into your approval workflow 
  // so it can be saved to the database.
  const { result } = await approveSubmissionWorkflow(req.scope).run({
    input: {
      submission: { 
        clientId: currentClientId,
        client_notes, 
        payment_method_id, // This is now saved to the Submission record
        submissionId 
      },
    },
  })

  res.json({ success: true, submission: result })
}
