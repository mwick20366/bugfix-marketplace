// src/api/store/submissions/[id]/approve/route.ts
import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { approveSubmissionWorkflow, ApproveSubmissionWorkflowInput } from "../../../../workflows/submission"
import { createPaymentSessionsWorkflow } from "@medusajs/medusa/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<ApproveSubmissionWorkflowInput>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const currentClientId = req.auth_context?.actor_id
  const submissionId = req.params.id

  // 1. Retrieve the submission and its associated bug (to get the bounty amount)
  // @ts-ignore
  const { data: [submission] } = await query.graph({
    entity: "submission",
    fields: ["id", "status", "notes", "file_url", "bug.*", "bug.client.*"],
    filters: { id: submissionId },
  }, { throwIfKeyNotFound: true })

  // Only the client who owns the bug can approve
  if (submission.bug?.client?.id !== currentClientId) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "You are not authorized to approve this submission"
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

  const paymentModuleService = req.scope.resolve(Modules.PAYMENT)
  
  // 2. Create a PaymentCollection for the bounty amount
  const paymentCollection = await paymentModuleService.createPaymentCollections({
    currency_code: "usd", // use your actual currency
    amount: submission.bug.bounty ?? 0,
  })

  // 3. Create a PaymentSession (this calls Stripe and returns a client_secret)
  const { result: paymentSession } = await createPaymentSessionsWorkflow(req.scope)
    .run({
      input: {
        payment_collection_id: paymentCollection.id,
        provider_id: "pp_stripe_stripe",
        data: {
          setup_future_usage: "off_session", // allows saving the card
        },
      },
    })

  // Execute approve workflow
  const { result } = await approveSubmissionWorkflow(req.scope).run({
    input: {
      submission: { ...req.validatedBody, submissionId },
    },
  })

  res.json({
    submission: result,
    clientSecret: paymentSession.data.client_secret,
    paymentSession,
  })
}