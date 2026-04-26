// src/api/store/submissions/[id]/finalize-approval/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { approveSubmissionWorkflow } from "../../../../workflows/submission"
import { capturePaymentWorkflow } from "@medusajs/medusa/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { PostCaptureSubmissionSchema } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<typeof PostCaptureSubmissionSchema>,
  res: MedusaResponse
) => {
  const currentClientId = req.auth_context?.actor_id
  const submissionId = req.params.id

  // 1. Retrieve the submission and its associated bug (to get the bounty amount)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [submission] } = await query.graph({
    entity: "submission",
    fields: ["id", "status", "notes", "file_url", "bug.*", "bug.client.*"],
    filters: { id: submissionId },
  }, { throwIfKeyNotFound: true })

  // Only the client who owns the bug can approve
  if (submission.bug?.client?.id !== currentClientId) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You are not authorized to capture payment for this submission"
    )
  }

  // Submission must be in a reviewable state
  // TODO: Remove comments after testing
  // if (submission.status !== "awaiting client review") {
  //   throw new MedusaError(
  //     MedusaError.Types.NOT_ALLOWED,
  //     "This submission is not awaiting client review"
  //   )
  // }

  const { payment_collection_id, client_notes } = req.validatedBody as any

  const { data: [paymentCollection] } = await query.graph({
    entity: "payment_collection",
    fields: ["payments.*", "payment_sessions.*"],
    filters: { id: payment_collection_id },
  })

  const paymentSession = paymentCollection.payment_sessions?.[0]

  if (!paymentSession) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "No payment session found for this payment collection"
    )
  }

  const paymentModuleService = req.scope.resolve(Modules.PAYMENT)

  const payment = await paymentModuleService.authorizePaymentSession(
    paymentSession.id,
    {}
  )

  if (!payment?.id) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "Payment authorization failed"
    )
  }

  // 1. Capture the payment first
  await capturePaymentWorkflow(req.scope).run({
    input: {
      payment_id: payment.id,
    },
  })

  // Execute approve workflow
  const { result } = await approveSubmissionWorkflow(req.scope).run({
    input: {
      submission: { client_notes, submissionId },
    },
  })

  res.json({ success: true, submission: result })
}

export { PostCaptureSubmissionSchema }
