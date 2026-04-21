// src/modules/developer/components/submission-status-filter/index.tsx
"use client"

import { Checkbox, Label } from "@medusajs/ui"

type FilterOption = {
  value: string
  label: string
}

const statusOptions: FilterOption[] = [
  { value: "awaiting client review", label: "Awaiting Client Review" },
  { value: "client approved", label: "Client Approved" },
  { value: "client rejected", label: "Client Rejected" },
]

type SubmissionStatusFilterProps = {
  selectedStatuses: string[]
  onStatusChange: (values: string[]) => void
}

export default function SubmissionStatusFilter({
  selectedStatuses,
  onStatusChange,
}: SubmissionStatusFilterProps) {
  const allSelected = selectedStatuses.length === 0 || selectedStatuses.includes("all")

  const handleAll = () => onStatusChange([])

  const handleOption = (value: string) => {
    if (selectedStatuses.includes(value)) {
      onStatusChange(selectedStatuses.filter((v) => v !== value))
    } else {
      onStatusChange([...selectedStatuses.filter((v) => v !== "all"), value])
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <p className="text-ui-fg-base text-sm font-medium">Status</p>
      <div className="flex items-center gap-x-2">
        <Checkbox id="status-all" checked={allSelected} onCheckedChange={handleAll} />
        <Label htmlFor="status-all" className="text-sm font-normal cursor-pointer">All</Label>
      </div>
      {statusOptions.map((option) => (
        <div key={option.value} className="flex items-center gap-x-2">
          <Checkbox
            id={`status-${option.value}`}
            checked={!allSelected && selectedStatuses.includes(option.value)}
            onCheckedChange={() => handleOption(option.value)}
          />
          <Label htmlFor={`status-${option.value}`} className="text-sm font-normal cursor-pointer">
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  )
}