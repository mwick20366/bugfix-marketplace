import React from "react"
import { Container, Heading, Text } from "@medusajs/ui"

export default function TermsOfServicePage() {
  return (
    <Container className="max-w-3xl mx-auto my-16 p-8">
      <Heading level="h1" className="text-3xl border-b pb-4 mb-6">
        Terms of Service
      </Heading>
      
      <Text className="text-ui-fg-muted italic mb-8">
        Last Updated: May 4, 2026
      </Text>

      <div className="space-y-8">
        <section>
          <Heading level="h2" className="text-xl mb-3">
            1. Nature of the Platform
          </Heading>
          <Text>
            Bugixa is a professional services marketplace that connects businesses (&quot;Clients&quot;) with freelance software developers (&quot;Developers&quot;). Bugixa facilitates the listing of software maintenance tasks and the processing of payments for completed services. Bugixa is not a law firm, a software development agency, or an employer.
          </Text>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            2. Relationship of Parties
          </Heading>
          <ul className="list-disc pl-5 space-y-2 text-ui-fg-subtle">
            <li>
              <strong>Independent Contractors:</strong> Developers are independent contractors. No employer-employee, agency, or joint venture relationship is created between any User and Bugixa.
            </li>
            <li>
              <strong>Service Contract:</strong> When a Client approves a Task submission, they are entering into a direct contract with the Developer. Bugixa is not a party to this contract.
            </li>
          </ul>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            3. Payments and Payouts
          </Heading>
          <Text className="mb-4">
            Payment processing services for Developers on Bugixa are provided by <strong>Stripe</strong> and are subject to the{" "}
            <a 
              href="https://stripe.com" 
              className="text-ui-fg-interactive hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Stripe Connected Account Agreement
            </a>.
          </Text>
          <ul className="list-disc pl-5 space-y-2 text-ui-fg-subtle">
            <li>
              <strong>Platform Fees:</strong> Bugixa charges a service fee for facilitating the transaction. Fees are automatically deducted from the total project fee at the time of payout.
            </li>
            <li>
              <strong>No Escrow:</strong> Bugixa does not hold funds in escrow. Payments are authorized by the Client upon approval and transferred directly to the Developer’s verified account.
            </li>
          </ul>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            4. Deliverables and Approval
          </Heading>
          <Text>
            Clients are only charged once they have reviewed and explicitly approved the Developer’s work. Due to the nature of digital services, all payments are final once approved by the Client. Any disputes regarding the quality of work must be resolved directly between the Client and the Developer.
          </Text>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            5. Prohibited Conduct
          </Heading>
          <Text>
            Users may not use Bugixa for money laundering, fraudulent financial transactions, or posting tasks involving illegal activities or malware. Circumventing the platform to avoid service fees is strictly prohibited.
          </Text>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            6. Limitation of Liability
          </Heading>
          <Text>
            Bugixa provides the platform &quot;as-is&quot; and is not responsible for the quality, safety, or legality of the tasks posted or the code provided by Developers.
          </Text>
        </section>
      </div>

      <footer className="mt-16 pt-8 border-t text-center text-ui-fg-muted text-xs">
        &copy; {new Date().getFullYear()} Bugixa. All rights reserved.
      </footer>
    </Container>
  )
}
