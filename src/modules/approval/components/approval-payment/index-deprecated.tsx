"use client"

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useState } from "react"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY || ""
)

export default function ApprovalPayment({
  clientSecret,
  onPaymentComplete,
}: {
  clientSecret: string
  onPaymentComplete: () => void
}) {
  console.log("Rendering ApprovalPayment with clientSecret:", clientSecret);
  
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <ApprovalPaymentForm
        clientSecret={clientSecret}
        onPaymentComplete={onPaymentComplete}
      />
    </Elements>
  )
}

const ApprovalPaymentForm = ({
  clientSecret,
  onPaymentComplete,
}: {
  clientSecret: string
  onPaymentComplete: () => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveCard, setSaveCard] = useState(false)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const card = elements?.getElement(CardElement)

    if (!stripe || !elements || !card || !clientSecret) {
      return
    }

    setLoading(true)

    const { error: stripeError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
        },
        // setup_future_usage is set server-side when creating the session
      }
    )

    if (stripeError) {
      setError(stripeError.message || "Payment failed")
      setLoading(false)
      return
    }

    onPaymentComplete()
    setLoading(false)
  }

  return (
    <form onSubmit={handlePayment}>
      <CardElement />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Confirm Fix & Pay Bounty"}
      </button>
    </form>
  )
}