import React from "react"
import { Container, Heading, Text } from "@medusajs/ui"

export default function PrivacyPolicyPage() {
  return (
    <Container className="max-w-3xl mx-auto my-16 p-8">
      <Heading level="h1" className="text-3xl border-b pb-4 mb-6">
        Privacy Policy
      </Heading>
      
      <Text className="text-ui-fg-muted italic mb-8">
        Last Updated: May 4, 2026
      </Text>

      <div className="space-y-8">
        <section>
          <Heading level="h2" className="text-xl mb-3">
            1. Information We Collect
          </Heading>
          <Text className="mb-4">
            We collect information you provide directly to us when you create an account, post a task, or submit a bug fix. This includes:
          </Text>
          <ul className="list-disc pl-5 space-y-2 text-ui-fg-subtle">
            <li><strong>Personal Details:</strong> Name, email address, and professional tech stack.</li>
            <li><strong>Transaction Info:</strong> Project budgets, bounty amounts, and submission history.</li>
            <li><strong>Payment Metadata:</strong> We store Stripe Customer and Account IDs to facilitate payouts.</li>
          </ul>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            2. Payment Data & Security
          </Heading>
          <Text>
            Bugixa does not store sensitive credit card or bank account numbers on our servers. All payment data is handled securely by <strong>Stripe</strong>. Developers providing bank information do so via Stripe&apos;s secure embedded components, ensuring your financial data never touches our infrastructure.
          </Text>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            3. How We Use Your Information
          </Heading>
          <ul className="list-disc pl-5 space-y-2 text-ui-fg-subtle">
            <li>To connect Clients and Developers for software maintenance tasks.</li>
            <li>To process payouts and facilitate professional communication.</li>
            <li>To comply with tax and legal requirements (KYC) via our payment partners.</li>
          </ul>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            4. Third-Party Services
          </Heading>
          <Text>
            We share necessary data with third-party providers to operate our platform:
          </Text>
          <ul className="list-disc pl-5 space-y-2 text-ui-fg-subtle">
            <li><strong>Stripe:</strong> For payment processing and identity verification.</li>
            <li><strong>SendGrid:</strong> For transactional emails and notifications.</li>
            <li><strong>AWS:</strong> For secure data storage and hosting.</li>
          </ul>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            5. Your Rights
          </Heading>
          <Text>
            You have the right to access, correct, or delete your personal information at any time via your account settings. For full account deletion requests, please contact our support team.
          </Text>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            6. Changes to This Policy
          </Heading>
          <Text>
            We may update this policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
          </Text>
        </section>
      </div>

      <footer className="mt-16 pt-8 border-t text-center text-ui-fg-muted text-xs">
        &copy; {new Date().getFullYear()} Bugixa. Your privacy is our priority.
      </footer>
    </Container>
  )
}
