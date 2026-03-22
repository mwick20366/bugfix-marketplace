import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { Bug } from "@medusajs/icons"
import BugForm from "@modules/bugs/components/form"
import { retrieveClient } from "@lib/data/client"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

// type Params = {
//   searchParams: Promise<{
//     sortBy?: SortOptions
//     page?: string
//   }>
//   params: Promise<{
//     countryCode: string
//   }>
// }

export default async function NewBugPage() {
  const client = await retrieveClient();

  if (!client) {
    return notFound()
  }
  
  return (
    <BugForm client={client} />
  )
}
