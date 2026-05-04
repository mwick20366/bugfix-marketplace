// apps/backend/src/api/developers/onboarding/route.ts
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import updateDeveloperWorkflow from "../../../../workflows/developer/steps/update-developer";

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
) {
  // 1. Properly resolve tools from Medusa scope
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const developerId = req.auth_context?.actor_id;
  const stripe = require("stripe")(process.env.STRIPE_API_KEY);

  try {
    // 2. Check if developer already has a Stripe ID to prevent duplicates
    const {
      data: [developer],
    } = await query.graph({
      entity: "developer",
      fields: ["stripe_account_id"],
      filters: { id: developerId },
    });

    let stripeAccountId = developer?.stripe_account_id ?? undefined;

    // 3. Create the Stripe Account ONLY if it doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        business_type: "individual", // <--- This simplifies the form for devs
        email: developer.email, // <--- Pre-fill with developer's email
        individual: {
          first_name: developer.first_name, // <--- Pre-fill with developer's first name
          last_name: developer.last_name, // <--- Pre-fill with developer's last name
        },
        business_profile: {
          // This pre-fills the "Industry" section
          mcc: "7372",
          // This pre-fills the "Website" section
          url: "https://bugixa.com",
        },
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
      });

      stripeAccountId = account.id;

      // 4. Run your Workflow using the request scope (req.scope)
      await updateDeveloperWorkflow(req.scope).run({
        input: {
          id: developerId,
          stripe_account_id: stripeAccountId,
        },
      });
    }

    // 5. Create the Session for the embedded component
    const accountSession = await stripe.accountSessions.create({
      account: stripeAccountId,
      components: {
        account_onboarding: {
          enabled: true,
          features: {
            external_account_collection: true,
          },
        },
      },
    });

    res.json({ client_secret: accountSession.client_secret });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stripe session failed";
    res.status(500).json({ message });
  }
}
