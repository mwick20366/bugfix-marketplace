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
      .fetch<{ bugs: Bug[] }>(`/bugs/client/${clientId}`, {
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
