"use client"
import React, { useState } from "react"
import { loadConnectAndInitialize } from "@stripe/connect-js"
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
} from "@stripe/react-connect-js" // Update this line!

export default function PayoutSetup({
  clientSecret,
}: {
  clientSecret: string
}) {
  const [stripeConnectInstance] = useState(() =>
    loadConnectAndInitialize({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_KEY!,
      fetchClientSecret: async () => clientSecret,
      appearance: {
        variables: {
          colorPrimary: "#000000", // Match your Bugixa theme
        },
      },
    })
  )

  return (
    <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
      <div className="border rounded-lg p-4 bg-white">
        <ConnectAccountOnboarding
          onExit={() => {
            console.log("Onboarding exited")
            // Refresh the profile data here
          }}
        />
      </div>
    </ConnectComponentsProvider>
  )
}
