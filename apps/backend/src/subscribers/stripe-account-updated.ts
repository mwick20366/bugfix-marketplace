// apps/backend/src/subscribers/stripe-account-updated.ts
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import updateDeveloperWorkflow from "../workflows/developer/steps/update-developer";

export default async function stripeAccountHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const { data } = event;
  const stripeEvent = data.payload.data; // In Medusa v2, the Stripe event is nested here

  // 1. Check for both event types
  if (
    stripeEvent.type !== "account.updated" &&
    stripeEvent.type !== "capability.updated"
  ) {
    return;
  }

  // 2. Extract the account object
  // (For capability.updated, the 'account' ID is in the top level of the event)
  const stripeAccountId = stripeEvent.account;

  // 3. For the 'isReady' check, we need to look at the 'requirements'
  // of the specific object that was updated.
  const object = stripeEvent.data.object;
  const isReady =
    object.requirements?.currently_due?.length === 0 &&
    object.status === "active";

  if (isReady) {
    // We need to find which developer owns this acct_id
    const query = container.resolve("query");
    const {
      data: [developer],
    } = await query.graph({
      entity: "developer",
      fields: ["id"],
      filters: { stripe_account_id: stripeAccountId },
    });

    if (developer) {
      // Run your existing workflow to flip the bit
      await updateDeveloperWorkflow(container).run({
        input: {
          id: developer.id,
          is_payout_ready: true, // Ensure this field exists in your data model!
        },
      });
      console.log(`Developer ${developer.id} is now Payout Ready!`);
    }
  }
}

export const config: SubscriberConfig = {
  event: "payment.webhook_received",
};
