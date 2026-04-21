"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "bounty_asc" | "bounty_desc" | "created_at"

type SortBugsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Bugs",
  },
  {
    value: "bounty_asc",
    label: "Bounty: Low -> High",
  },
  {
    value: "bounty_desc",
    label: "Bounty: High -> Low",
  },
]

const SortBugs = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortBugsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title="Sort by"
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortBugs
