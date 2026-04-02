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
    //submission: {
      client_notes: notes,
    // }
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
