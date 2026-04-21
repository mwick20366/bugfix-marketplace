// src/modules/developer/components/my-submissions-view/index.tsx
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import SubmissionStatusFilter from "../submission-status-filter"
import MySubmissions from "../my-submissions"

export default function MySubmissionsView({ developer }: { developer: any }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedStatuses = searchParams.getAll("status")

  const updateFilters = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete(key)
      values.forEach((v) => params.append(key, v))
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  return (
    <div className="flex gap-x-8">
      <aside className="w-48 shrink-0">
        <SubmissionStatusFilter
          selectedStatuses={selectedStatuses}
          onStatusChange={(values: string[]) => updateFilters("status", values)}
        />
      </aside>
      <div className="flex-1">
        <MySubmissions
          developer={developer}
          statusFilter={selectedStatuses}
          queryParams={{}}
        />
      </div>
    </div>
  )
}