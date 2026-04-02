import { retrieveDeveloperBugs } from "@lib/data/bugs"
import { retrieveClient } from "@lib/data/client"
import { retrieveDeveloper } from "@lib/data/developer"
import DeveloperSubmissions from "@modules/client/components/developer-submissions"
import MySubmissions from "@modules/developer/components/my-submissions"
// import BugsList from "@modules/marketplace/components/open-bugs"
// import { useState } from "react"
import { redirect } from "next/navigation"

const SUBMISSIONS_LIMIT = 15

type Params = {
  searchParams: Promise<{
    limit?: number
    offset?: number
    sortId?: string
    sortDesc?: boolean
    q?: string
  }>
}

export default async function Page(props: Params) {
  const client = await retrieveClient().catch(() => null)

  if (!client) {
    redirect(`/login?redirectTo=${encodeURIComponent(window.location.href)}`)
  }

  const queryParams = await props.searchParams
  const { limit, offset, sortId, sortDesc, q } = queryParams

  const submissionsListQueryParams = {
    limit: limit || SUBMISSIONS_LIMIT,
    offset: offset || 0,
    q: q || "",
    client: client
  }

  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        <DeveloperSubmissions
          queryParams={submissionsListQueryParams}
        />
      </div>
    </div>
  )
}
