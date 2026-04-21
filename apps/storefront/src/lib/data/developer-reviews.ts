"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import {
  getAuthHeaders,
  getCacheTag,
} from "./cookies"

// export type Developer = Member & {
//   // any developer specific fields
//   bugs?: Bug[],
//   submissions?: Submission[],
// }

// export const retrieveDeveloperReviews =
//   async (): Promise<Developer | null> => {
//     const authHeaders = await getAuthHeaders()

//     if (!authHeaders) return null

//     const headers = {
//       ...authHeaders,
//     }

//     const next = {
//       ...(await getCacheOptions("developers")),
//     }

//     return await sdk.client
//       .fetch<{ developer: Developer }>(`/developers/me`, {
//         method: "GET",
//         headers,
//         next,
//         cache: "force-cache",
//       })
//       .then(({ developer }) => developer)
//       .catch(() => null)
//   }

export const createDeveloperReview = async (review: {
  rating: number
  notes?: string
  developer_id: string
  submission_id: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const res = await sdk.client.fetch("/developer-reviews", {
    method: "POST",
    body: review,
    headers,
  })

  const cacheTag = await getCacheTag("developer-submissions")
  revalidateTag(cacheTag)

  return res
}