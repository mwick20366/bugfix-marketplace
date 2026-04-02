"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { SavedPaymentMethod } from "@lib/data/payment"
import SavedPaymentMethods from "../saved-payment-methods"
import ApprovalPayment from "../approval-payment"
import Modal from "@modules/common/components/modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  clientSecret: string
  paymentSession?: HttpTypes.StorePaymentSession
  onPaymentComplete: () => void
}

export default function ApprovalModal({
  isOpen,
  onClose,
  clientSecret,
  paymentSession,
  onPaymentComplete,
}: Props) {
  const [selectedSavedMethod, setSelectedSavedMethod] =
    useState<SavedPaymentMethod | null>(null)
  const [showNewCardForm, setShowNewCardForm] = useState(false)

  console.log("ApprovalModal open?", isOpen);
  console.log("Received clientSecret:", clientSecret)
  
  return (
    <Modal isOpen={isOpen} close={onClose}>
      <Modal.Title>
        Confirm Fix & Pay Bounty
      </Modal.Title>
      <Modal.Body>
        {/* Show saved methods if available */}
        <SavedPaymentMethods
          paymentSession={paymentSession}
          onSelect={(method) => {
            setSelectedSavedMethod(method)
            setShowNewCardForm(false)
          }}
        />

        {/* Option to use a new card */}
        {!showNewCardForm && (
          <button type="button" onClick={() => setShowNewCardForm(true)}>
            Use a new payment method
          </button>
        )}

        {/* Show card form if no saved method selected or using new card */}
        {(!selectedSavedMethod || showNewCardForm) && (
          <ApprovalPayment
            clientSecret={clientSecret}
            onPaymentComplete={onPaymentComplete}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        {/* Confirm with saved method */}
        {selectedSavedMethod && !showNewCardForm && (
          <button type="button" onClick={onPaymentComplete}>
            Confirm Fix & Pay Bounty
          </button>
        )}        
      </Modal.Footer>
    </Modal>
  )
}