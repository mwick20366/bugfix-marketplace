"use client"

import { Bug } from "@lib/data/bugs"
import { Submission } from "@lib/data/submissions"
import { convertToLocale } from "@lib/util/money"
import { Badge, createDataTableColumnHelper, DataTableColumnDef, DataTablePaginationState } from "@medusajs/ui"

const columnHelper = createDataTableColumnHelper<Submission>()

export const convertDateToRelative = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)

    if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`
    return "Just now"
}

export const titleColumn = columnHelper.accessor("bug.title", {
  header: "Bug",
  enableSorting: true,
  sortLabel: "Bug",
  sortAscLabel: "A-Z",
  sortDescLabel: "Z-A",
})

export const descriptionColumn = columnHelper.accessor("bug.description", {
  header: "Bug Description",
  enableSorting: false,
})

export const notesColumn = columnHelper.accessor("notes", {
    header: "Notes",
    enableSorting: false,
  })

export const fileColumn = columnHelper.accessor("file_url", {
  header: "File",
  enableSorting: false,
  cell: ({ getValue }) => {
    const file_url = getValue() as string
    if (!file_url) {
      return <span className="text-ui-fg-muted">-</span>
    }

    return (
    <a href={file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        View File
    </a>
    )
  }
})

export const submittedColumn = columnHelper.accessor("created_at", {
  header: "Submitted",
  enableSorting: true,
  sortLabel: "Submitted",
  sortAscLabel: "Oldest first",
  sortDescLabel: "Newest first",
  cell: ({ getValue }) => {
    const date = getValue() as string
    return convertDateToRelative(date)
  }
})

export const developerStatusColumn = columnHelper.accessor("status", {
  header: "Status",
  enableSorting: true,
  sortLabel: "Status",
  sortAscLabel: "A-Z",
  sortDescLabel: "Z-A",
  cell: ({ getValue }) => {
    const status = getValue() as string

    const getColor = (status: string) => {
      switch (status) {
        case "open":
          return "green"
        case "claimed":
          return "blue"
        case "fix submitted":
          return "orange"
        case "awaiting client review":
          return "orange"          
        case "client approved":
          return "purple"
        case "client rejected":
          return "red"
        default:
          return "grey"
      }
    }

    const getLabel = (status: string) => {
      switch (status) {
        case "open": return "Open"
        case "claimed": return "Claimed"
        case "fix submitted": return "Fix Submitted"
        case "awaiting client review": return "Awaiting Client Review"
        case "client approved": return "Client Approved"
        case "client rejected": return "Client Rejected"
        default: return status
      }
    }

    return (
      <Badge color={getColor(status)} size="2xsmall" rounded="full">
        {getLabel(status)}
      </Badge>
    )
  },
})

export const clientStatusColumn = columnHelper.accessor("status", {
  header: "Status",
  enableSorting: true,
  sortLabel: "Status",
  sortAscLabel: "A-Z",
  sortDescLabel: "Z-A",
  cell: ({ getValue }) => {
    const status = getValue() as string

    const getColor = (status: string) => {
      switch (status) {
        case "open":
          return "green"
        case "claimed":
          return "blue"
        case "fix submitted":
          return "orange"
        case "awaiting client review":
          return "orange"          
        case "client approved":
          return "purple"
        case "client rejected":
          return "red"
        default:
          return "grey"
      }
    }

    const getLabel = (status: string) => {
      switch (status) {
        case "open": return "Open"
        case "claimed": return "Claimed"
        case "fix submitted": return "Fix Submitted"
        case "awaiting client review": return "Awaiting Review"
        case "client approved": return "Approved"
        case "client rejected": return "Rejected"
        default: return status
      }
    }

    return (
      <Badge color={getColor(status)} size="2xsmall" rounded="full">
        {getLabel(status)}
      </Badge>
    )
  },
})