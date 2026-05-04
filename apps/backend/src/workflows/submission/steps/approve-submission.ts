import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { BUGTRACKER_MODULE } from "../../../modules/bugtracker";
import BugTrackerModuleService from "../../../modules/bugtracker/service";

export type ApproveSubmissionStepInput = {
  submissionId: string;
  clientId: string;
  client_notes?: string;
  payment_method_id?: string;
};

export const approveSubmissionStep = createStep(
  "approve-submission-step",
  async (input: ApproveSubmissionStepInput, { container }) => {
    const service: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE);
    const stripe = require("stripe")(process.env.STRIPE_API_KEY);

    // 1. Fetch the client info from your database
    const client = await service.retrieveClient(input.clientId);
    let stripeCustomerId = client.stripe_customer_id;

    // 2. If they don't have a Stripe ID, create one now
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: client.email,
        name: `${client.contact_first_name} ${client.contact_last_name}`,
      });
      stripeCustomerId = customer.id;

      // Save it back to the Client record
      await service.updateClients({
        id: client.id,
        stripe_customer_id: stripeCustomerId,
      });
    }

    // 3. Update the submission with the status and the card token
    const submission = await service.updateSubmissions({
      id: input.submissionId,
      status: "client approved",
      notes: input.client_notes,
      payment_method_id: input.payment_method_id, // The pm_... from the frontend
    });

    return new StepResponse(submission);
  },
  async (compensationData, { container }) => {
    if (!compensationData) return;
    const service: BugTrackerModuleService =
      container.resolve(BUGTRACKER_MODULE);
    // Undo in reverse order:
    const originalSubmission = await service.retrieveSubmission(
      compensationData.id as string,
    );
    const bugId = originalSubmission.bug_id;

    // 1. Revert the bug's status back to "fix submitted"
    if (bugId) {
      await service.updateBugs({
        id: bugId,
        status: "fix submitted",
      });
    }

    const { id } = compensationData;

    // 2. Revert the submission's status back to "awaiting client review"
    if (id) {
      await service.updateSubmissions({
        id: id,
        status: "awaiting client review",
      });
    }
  },
);
