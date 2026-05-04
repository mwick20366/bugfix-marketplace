// apps/backend/src/api/submissions/[id]/pay/route.ts
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { processBountyPaymentWorkflow } from "../../../../workflows/payment/steps/process-bounty-payment";
import { BUGTRACKER_MODULE } from "../../../../modules/bugtracker";

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) => {
  const { id } = req.params; // The submission ID
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    // 1. Fetch submission, linked bug (bounty), and the client/developer IDs
    const {
      data: [submission],
    } = await query.graph({
      entity: "submission",
      fields: [
        "id",
        "payment_method_id", // Pre-authorized card from client
        "bug.bounty",
        "bug.client.stripe_customer_id",
        "developer.stripe_account_id",
      ],
      filters: { id },
    });

    if (!submission || !submission.payment_method_id) {
      return res
        .status(400)
        .json({ message: "Payment method not found on submission" });
    }

    if (
      !submission.developer ||
      !submission.bug.client.stripe_customer_id ||
      !submission.developer.stripe_account_id
    ) {
      return res
        .status(400)
        .json({ message: "Stripe IDs not configured for client or developer" });
    }

    // 2. Calculate the Platform Fee (15%)
    const bounty = submission.bug.bounty || 0;
    const feeAmount = Math.round(bounty * 0.15 * 100); // Convert to cents
    const totalAmount = Math.round(bounty * 100);

    // 3. Execute the Workflow
    const { result } = await processBountyPaymentWorkflow(req.scope).run({
      input: {
        submissionId: id,
        amount: totalAmount,
        feeAmount: feeAmount,
        clientStripeId: submission.bug.client.stripe_customer_id,
        developerStripeAccountId: submission.developer.stripe_account_id,
        paymentMethodId: submission.payment_method_id,
      },
    });

    const service = req.scope.resolve(BUGTRACKER_MODULE);
    await service.updateSubmissions({
      id: id,
      status: "client paid",
    });

    // 4. Return success to the storefront
    res.json({ success: true, paymentIntentId: result.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Payment processing failed";
    res.status(500).json({ message });
  }
};
