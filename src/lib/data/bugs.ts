"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"
import { Developer } from "./developer"
import { cli } from "webpack"
import { SortOptions } from "@modules/marketplace/components/refinement-list/sort-bugs"
import { sortBugs } from "@lib/util/sort-bugs"

export type Bug = {
    id: string,
    title: string,
    description: string,
    techStack: string,
    repoLink: string,
    bounty: number,
    status: string,
    createdAt: string,
    updatedAt: string,
    developer?: Developer
}

export const retrieveBug =
  async (id: string): Promise<Bug | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null;

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("bug")),
    }

    return await sdk.client
      .fetch<{ bug: Bug }>(`/bugs/${id}`, {
        method: "GET",
        // query: {
        //   fields: "*orders",
        // },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ bug }) => bug)
      .catch(() => null)    
  }

// export const listBugs =
//   async (
//     limit: number = 10,
//     offset: number = 0,
//     filters?: Record<string, any>
//   ): Promise<Bug[]> => {
//     const authHeaders = await getAuthHeaders()

//     if (!authHeaders) return []

//     const headers = {
//       ...authHeaders,
//     }

//     const next = {
//       ...(await getCacheOptions("bugs")),
//     }

//     return sdk.client
//       .fetch<{ bugs: Bug[] }>(`/bugs`, {
//         method: "GET",
//         query: {
//           limit,
//           offset,
//           order: "-created_at",
//           // fields: "*items,+items.metadata,*items.variant,*items.product",
//           ...filters,
//         },
//         headers,
//         next,
//         cache: "force-cache",
//       })
//       .then(({ bugs }) => bugs)
//       .catch(() => [])
//   }

export const listBugs = async ({
  pageParam = 1,
  queryParams,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & { q?: string, status?: string }
}): Promise<{
  response: { bugs: Bug[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & { q?: string, status?: string }
}> => {
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("bugs")),
  }

  return sdk.client
    .fetch<{ bugs: Bug[]; count: number }>(
      `/bugs`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          // fields:
          //   "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ bugs, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          bugs,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

export const listBugsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & { q?: string, status?: string }
  sortBy?: SortOptions
}): Promise<{
  response: { bugs: Bug[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & { q?: string, status?: string }
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { bugs, count },
  } = await listBugs({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
  })

  const sortedBugs = sortBugs(bugs, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedBugs = sortedBugs.slice(pageParam, pageParam + limit)

  return {
    response: {
      bugs: paginatedBugs,
      count,
    },
    nextPage,
    queryParams,
  }
}

export const retrieveClientBugs =
  async (clientId: string): Promise<Bug[]> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return []

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("bugs")),
    }

    return await sdk.client
      .fetch<{ bugs: Bug[] }>(`/bugs/clients/${clientId}`, {
        method: "GET",
        // query: {
        //   fields: "*orders",
        // },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ bugs }) => bugs)
      .catch(() => [])
  }

export const retrieveDeveloperBugs =
  async (developerId: string): Promise<Bug[] | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ bugs: Bug[] }>(`/bugs/developer/${developerId}`, {
        method: "GET",
        // query: {
        //   fields: "*orders",
        // },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ bugs }) => bugs)
      .catch(() => null)
  }

export const addClientBug = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {

  console.log('Adding bug with form data:', Object.fromEntries(formData.entries()))

  const bug = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    techStack: formData.get("techStack") as string,
    repoLink: formData.get("repoLink") as string,
    bounty: parseFloat(formData.get("bounty") as string),
    client_id: formData.get("clientId") as string,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return await sdk.client.fetch(`/bugs`, {
    method: "POST",
    body: bug,
    headers,
    })
    .then(async () => {
      const cacheTag = await getCacheTag("bugs")
      revalidateTag(cacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateClientBug = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {

  const bug = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    techStack: formData.get("techStack") as string,
    repoLink: formData.get("repoLink") as string,
    bounty: parseFloat(formData.get("bounty") as string),
    client_id: formData.get("clientId") as string,
    id: formData.get("bugId") as string,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return await sdk.client.fetch(`/bug`, {
    method: "PUT",
    body: bug,
    headers,
    })
    .then(async () => {
      const cacheTag = await getCacheTag("bugs")
      revalidateTag(cacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}
