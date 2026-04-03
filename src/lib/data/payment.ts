"use server"
import { getAuthHeaders } from "./cookies"
import { sdk } from "@lib/config"
import { Submission } from "./submissions"

export type SavedPaymentMethod = {
  id: string
  provider_id: string
  data: {
    card: {
      brand: string
      last4: string
      exp_month: number
      exp_year: number
    }
  }
}

// TODO: fetch calls should be done from /src/lib/data/payment.ts and not from the component directly. We can export functions like getSavedPaymentMethods, initiateApprovalPayment, captureAndApprove from this file and use them in the component. This way we keep all payment related logic in one place and the component code cleaner.
export const getSavedPaymentMethods = async (accountHolderId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ payment_methods: SavedPaymentMethod[] }>(
      `store/marketplace/payment-methods/${accountHolderId}`,
      {
        method: "GET",
        headers,
      }
    )
    .catch(() => {
      return { payment_methods: [] }
    })
}

export const initiateApprovalPayment = async (
  submissionId: string,
  notes?: string
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const body = {
    client_notes: notes,
  }

  return sdk.client.fetch<{
    submission: Submission,
    clientSecret: string
    paymentSession: any
  }>(`/submissions/${submissionId}/approve`, {
    method: "POST",
    body,
    headers,
  })
}

export const captureAndApprove = async (
  submissionId: string,
  paymentId: string,
  clientNotes?: string
) => {
  const headers = { ...(await getAuthHeaders()) }

  return sdk.client.fetch(`/store/submissions/${submissionId}/capture`, {
    method: "POST",
    body: { payment_id: paymentId, client_notes: clientNotes },
    headers,
  })
}