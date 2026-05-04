// apps/backend/src/workflows/payment/process-bounty-payment.ts
import { 
  createWorkflow, 
  createStep, 
  StepResponse, 
  WorkflowResponse 
} from "@medusajs/framework/workflows-sdk";

export type ProcessPaymentInput = {
  submissionId: string;
  amount: number;         // e.g., 10000 for $100.00
  feeAmount: number;      // e.g., 1500 for $15.00
  clientStripeId: string;
  developerStripeAccountId: string;
  paymentMethodId: string;
};

const captureAndTransferStep = createStep(
  "capture-and-transfer-step",
  async (input: ProcessPaymentInput, { container }) => {
    const stripe = require("stripe")(process.env.STRIPE_API_KEY);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: input.amount,
      currency: "usd",
      customer: input.clientStripeId,
      payment_method: input.paymentMethodId,
      off_session: true, // Allows charging the card without the client present
      confirm: true,     // Creates and confirms the payment in one call
      application_fee_amount: input.feeAmount,
      transfer_data: {
        destination: input.developerStripeAccountId,
      },
    });

    return new StepResponse(paymentIntent);
  }
);

export const processBountyPaymentWorkflow = createWorkflow(
  "process-bounty-payment",
  (input: ProcessPaymentInput) => {
    const paymentResult = captureAndTransferStep(input);
    return new WorkflowResponse(paymentResult);
  }
);
