// src/modules/developer/components/my-bugs-view/index.tsx
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import BugFilters from "@modules/developer/components/bug-filters"
import MyBugs from "@modules/developer/components/my-bugs"

export default function MyBugsView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read filters from URL
  const selectedStatuses = searchParams.getAll("status")
  const selectedDifficulties = searchParams.getAll("difficulty")

  const updateFilters = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString())

      // Remove existing values for this key
      params.delete(key)

      // Add new values
      values.forEach((v) => params.append(key, v))

      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  return (
    <div className="flex gap-x-8">
      <aside className="w-48 shrink-0">
        <BugFilters
          selectedStatuses={selectedStatuses}
          selectedDifficulties={selectedDifficulties}
          onStatusChange={(values) => updateFilters("status", values)}
          onDifficultyChange={(values) => updateFilters("difficulty", values)}
        />
      </aside>

      <div className="flex-1">
        <MyBugs
          statusFilter={selectedStatuses}
          difficultyFilter={selectedDifficulties}
        />
      </div>
    </div>
  )
}