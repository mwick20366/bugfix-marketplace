"use client"

import { Bug } from "@lib/data/bugs"
import {
  DataTable,
  useDataTable,
  DataTablePaginationState,
  DataTableSortingState,
  Button,
  DataTableColumnDef,
} from "@medusajs/ui"

import {
  bountyColumn,
  createdAtColumn,
  descriptionColumn,
  tech_stackColumn,
  titleColumn
} from "./columns"

const defaultColumns = [
  titleColumn,
  descriptionColumn,
  tech_stackColumn,
  createdAtColumn,
  bountyColumn,
];

type BugsListTemplateProps = {
  bugs: Bug[]
  columns?: DataTableColumnDef<Bug>[],
  rowCount: number
  isLoading: boolean
  pagination: DataTablePaginationState
  setPagination: (pagination: DataTablePaginationState) => void
  sorting: DataTableSortingState | null
  setSorting: (sorting: DataTableSortingState | null) => void
  queryParams?: {
    limit?: number,
    offset?: number,
    q?: string,
    status?: string,
    developer_id?: string,
    client_id?: string,
  }
  search?: string
  setSearch: (search: string) => void
  actionButtons?: React.ReactNode
  onRowClick?: (bug: Bug) => void
}

const BugsListTemplate = ({
  bugs,
  rowCount,
  isLoading,
  pagination,
  setPagination,
  sorting,
  setSorting,
  queryParams,
  search,
  setSearch,
  onRowClick,
  columns,
}: BugsListTemplateProps) => {
  const limit = queryParams?.limit || 15

  const table = useDataTable({
    columns: columns || defaultColumns,
    data: bugs,
    getRowId: (row) => row.id,
    rowCount: rowCount,
    isLoading,
    search: {
      state: search || "",
      onSearchChange: setSearch,
    },
    pagination: {
      state: pagination || {
        pageIndex: 0,
        pageSize: limit,
      },
      onPaginationChange: setPagination,
    },
    sorting: {
      state: sorting,
      onSortingChange: setSorting,
    },
  })
  
  if (onRowClick) {
    table.onRowClick = (event, row) => {
      if (onRowClick) {
        onRowClick(row.original)
      }
    }
  }

  return (
    <div
      // className={clx({
      //   "pl-[1px] overflow-y-scroll overflow-x-hidden no-scrollbar max-h-[420px]":
      //     hasOverflow,
      // })}
    >
      <DataTable instance={table}>
        <div className="mt-6 mb-6 flex gap-2 items-center">
          <DataTable.Search placeholder="Search..." />
          {search && (
            <Button
              variant="transparent"
              size="small"
              onClick={() => setSearch("")}
            >
              Clear
            </Button>
        )}
        </div>
        {/* <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <DataTable.SortingMenu tooltip="Sort" />
        </DataTable.Toolbar> */}
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </div>
  )
}

export default BugsListTemplate
