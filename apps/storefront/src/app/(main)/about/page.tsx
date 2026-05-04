import React from "react"
import { Container, Heading, Text } from "@medusajs/ui"

export default function AboutPage() {
  return (
    <Container className="max-w-3xl mx-auto my-16 p-8">
      <Heading level="h1" className="text-3xl border-b pb-4 mb-6">
        About Bugixa
      </Heading>

      <div className="space-y-10">
        <section>
          <Heading level="h2" className="text-xl mb-3">
            Our Mission
          </Heading>
          <Text className="text-lg text-ui-fg-subtle">
            Bugixa is a specialized marketplace designed to bridge the gap between businesses 
            with software maintenance needs and expert freelance developers. We believe that 
            software maintenance should be efficient, transparent, and fair for both sides.
          </Text>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Heading level="h3" className="text-lg mb-2">
              For Clients
            </Heading>
            <Text>
              Stop letting minor bugs stall your progress. Post a specific task, set your 
              budget, and only pay when the fix is verified and approved. No upfront 
              commitments or complex contracts.
            </Text>
          </div>
          <div>
            <Heading level="h3" className="text-lg mb-2">
              For Developers
            </Heading>
            <Text>
              Find high-quality, discrete tasks that fit your tech stack. Get paid 
              directly into your bank account via our secure Stripe integration as 
              soon as your fix is approved.
            </Text>
          </div>
        </section>

        <section className="bg-ui-bg-subtle p-6 rounded-lg border border-ui-border-base">
          <Heading level="h3" className="text-lg mb-3">
            Professional & Secure
          </Heading>
          <Text>
            Built on a foundation of trust, Bugixa leverages industry-standard 
            security and payment infrastructure. We operate as a professional 
            brokerage, facilitating clear communication and guaranteed payouts 
            for verified work.
          </Text>
        </section>

        <section>
          <Heading level="h2" className="text-xl mb-3">
            The Marketplace Model
          </Heading>
          <Text>
            Following in the footsteps of established professional networks like Upwork, 
            Bugixa provides the infrastructure for a modern freelance economy. We 
            handle the identity verification, payment processing, and dispute resolution 
            so you can focus on the code.
          </Text>
        </section>
      </div>

      <footer className="mt-16 pt-8 border-t text-center text-ui-fg-muted text-xs">
        &copy; {new Date().getFullYear()} Bugixa. Software Maintenance Marketplace.
      </footer>
    </Container>
  )
}
