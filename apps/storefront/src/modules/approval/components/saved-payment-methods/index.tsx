"use client"

import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import {
  SavedPaymentMethod,
  getSavedPaymentMethods,
} from "@lib/data/payment"

type Props = {
  paymentSession?: HttpTypes.StorePaymentSession
  onSelect: (method: SavedPaymentMethod) => void
}

export default function SavedPaymentMethods({
  paymentSession,
  onSelect,
}: Props) {
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<
    SavedPaymentMethod[]
  >([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(paymentSession?.data?.payment_method as string | null)

  useEffect(() => {
    const accountHolderId = (
      paymentSession?.context?.account_holder as Record<string, string>
    )?.id

    if (!accountHolderId) {
      return
    }

    getSavedPaymentMethods(accountHolderId).then(({ payment_methods }) => {
      setSavedPaymentMethods(payment_methods)
    })
  }, [paymentSession])

  if (!savedPaymentMethods.length) {
    return <></>
  }

  return (
    <div>
      {savedPaymentMethods.map((method) => (
        <div
          key={method.id}
          role="button"
          onClick={() => {
            setSelectedPaymentMethod(method.id)
            onSelect(method)
          }}
        >
          <input
            type="radio"
            name="saved-payment-method"
            value={method.id}
            checked={selectedPaymentMethod === method.id}
            onChange={() => {
              setSelectedPaymentMethod(method.id)
              onSelect(method)
            }}
          />
          <span>
            {method.data.card.brand} •••• {method.data.card.last4}
          </span>
          <span>
            Expires {method.data.card.exp_month}/{method.data.card.exp_year}
          </span>
        </div>
      ))}
    </div>
  )
}