import { Metadata } from "next"

import Overview from "@modules/developer/account/components/overview"
import { notFound } from "next/navigation"
import { retrieveDeveloper } from "@lib/data/developer"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export default async function OverviewTemplate() {
  const developer = await retrieveDeveloper().catch(() => null)

  if (!developer) {
    notFound()
  }

  return <Overview developer={developer} />
}
