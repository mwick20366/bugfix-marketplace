// src/modules/approval/components/approval-modal/index.tsx
"use client"

import { useState } from "react"
import { Button, Textarea } from "@medusajs/ui"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Modal from "@modules/common/components/modal"
import { PaymentForm } from "../approval-payment"
import { useInitiateSubmissionApproval } from "@lib/hooks/use-initiate-submission-approval copy"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "")

type Phase = "notes" | "payment" | "done"

export default function ApprovalModal({
  submissionId,
  isOpen,
  close,
  onApprovalFinalized,
}: {
  submissionId: string
  isOpen: boolean
  close: () => void
  onApprovalFinalized: () => void
}) {
  const [phase, setPhase] = useState<Phase>("notes")
  const [clientNotes, setClientNotes] = useState("")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentSession, setPaymentSession] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const { mutate: initiateApproval, isPending: isInitiating } = useInitiateSubmissionApproval(submissionId, {
    onSuccess: (data) => {
      console.log("Initiate approval success:", data)
      setClientSecret(data.clientSecret)
      setPaymentSession(data.paymentSession)
      setPhase("payment")
    },
    onError: (err: any) => {
      setError(err.message || "Failed to initiate payment. Please try again.")
    },
  })

  const handleApprove = () => {
    initiateApproval({ submissionId, clientNotes })
  }

  const handleClose = () => {
    setPhase("notes")
    setClientNotes("")
    setClientSecret(null)
    setPaymentSession(null)
    setError(null)
    close()
  }

  const title = {
    notes: "Approve Submission",
    payment: "Enter Payment Details",
    done: "Submission Approved",
  }[phase]

  return (
    <Modal isOpen={isOpen} close={handleClose} size="medium">
      <Modal.Title>{title}</Modal.Title>

      <Modal.Body>
        {phase === "notes" && (
          <>
            <Textarea
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="Enter your notes for the developer..."
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </>
        )}

        {phase === "payment" && clientSecret && (
          <>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm
                submissionId={submissionId}
                bounty={paymentSession?.amount || 0}
                clientSecret={clientSecret}
                paymentSession={paymentSession}
                clientNotes={clientNotes}
                onSuccess={() => {
                  setPhase("done")
                  onApprovalFinalized()
                }}
                onError={setError}
              />
            </Elements>
          </>
        )}

        {phase === "done" && <p>Payment successful! Submission approved.</p>}
      </Modal.Body>

      <Modal.Footer>
        {phase === "notes" && (
          <Button onClick={handleApprove} isLoading={isInitiating}>
            Approve
          </Button>
        )}
        {phase === "done" && (
          <Button onClick={handleClose}>Close</Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}