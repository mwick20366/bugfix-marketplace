// src/modules/developer/components/bug-marketplace-view/index.tsx
"use client"

import { useState } from "react"
import BugFilters from "@modules/developer/components/bug-filters"
import MyBugs from "@modules/developer/components/my-bugs"

export default function BugMarketplaceView() {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])

  return (
    <div className="flex gap-x-8">
      {/* Sidebar filters — placed under account navigation */}
      <aside className="w-48 shrink-0">
        <BugFilters
          selectedStatuses={selectedStatuses}
          selectedDifficulties={selectedDifficulties}
          onStatusChange={setSelectedStatuses}
          onDifficultyChange={setSelectedDifficulties}
        />
      </aside>

      {/* Bug list */}
      <div className="flex-1">
        <MyBugs
          statusFilter={selectedStatuses}
          difficultyFilter={selectedDifficulties}
        />
      </div>
    </div>
  )
}