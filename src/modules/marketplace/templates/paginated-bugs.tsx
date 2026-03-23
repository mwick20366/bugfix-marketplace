import { listBugsWithSort } from "@lib/data/bugs"
import { getRegion } from "@lib/data/regions"
import { Table } from "@medusajs/ui"
import BugsListTemplate from "@modules/bugs/components/list"
import Search from "@modules/common/components/search"
// import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/marketplace/components/pagination"
import { SortOptions } from "@modules/marketplace/components/refinement-list/sort-bugs"
import { Suspense } from "react"

const BUG_LIMIT = 12

type PaginatedBugsParams = {
  limit?: number
  q?: string
  status?: string
  order?: string
}

export default async function PaginatedBugs({
  sortBy,
  page,
  q,
  status,
}: {
  sortBy?: SortOptions
  page: number
  q?: string
  status?: string
}) {
  const queryParams: PaginatedBugsParams = {
    limit: 12,
    q: "",
    status: "open",
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  if (q) {
    queryParams["q"] = q
  }

  if (status) {
    queryParams["status"] = status
  }

  console.log("page", page)

  let {
    response: { bugs, count },
  } = await listBugsWithSort({
    page,
    queryParams,
    sortBy,
  })

  const totalPages = Math.ceil(count / BUG_LIMIT)

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Bugs</h1>
      </div>
      <div className="mt-4 pb-6 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search bugs..." />
      </div>
      <BugsListTemplate bugs={bugs} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </div>
  )
}
