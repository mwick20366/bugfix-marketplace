import { Metadata } from "next"

import Overview from "@modules/client/account/components/overview"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import { retrieveClient } from "@lib/data/client"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export default async function OverviewTemplate() {
  const client = await retrieveClient().catch(() => null)

  if (!client) {
    notFound()
  }

  return <Overview client={client} />
}
