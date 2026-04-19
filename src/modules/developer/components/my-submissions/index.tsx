// src/modules/developer/components/my-submissions/index.tsx
"use client"

import {
  Submission,
  listSubmissions
} from "@lib/data/submissions"
import { Developer } from "@lib/data/developer"
import {
  DataTablePaginationState,
  DataTableSortingState,
  DataTableColumnDef,
} from "@medusajs/ui"
import SubmissionsListTemplate from "@modules/submissions/components/list-template"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import SubmissionDetailsModal from "@modules/developer/components/submission-details-modal"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

const SUBMISSION_LIMIT = 15

type MySubmissionsProps = {
  queryParams: {
    limit?: number
    offset?: number
    q?: string
  }
  developer: Developer
  statusFilter?: string[]
}

export default function MySubmissions(props: MySubmissionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const { developer, statusFilter } = props

  const queryParams = {
    limit: SUBMISSION_LIMIT,
    developer_id: developer.id,
  }

  const sortingParams = {
    sortId: "created_at",
    sortDesc: true,
  }

  const limit = queryParams?.limit || 15

  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: limit,
  })

  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const [search, setSearch] = useState<string>("")
  const [sorting, setSorting] = useState<DataTableSortingState | null>(null)

  if (sortingParams && !sorting) {
    setSorting({
      id: sortingParams.sortId,
      desc: sortingParams.sortDesc,
    })
  }

  const queryKey = useMemo(() => {
    return [
      "my-submissions",
      limit,
      offset,
      search,
      sorting?.id,
      sorting?.desc,
      statusFilter,
    ]
  }, [offset, search, sorting?.id, sorting?.desc, statusFilter])

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => listSubmissions({
      queryParams: {
        ...queryParams,
        limit,
        offset,
        order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
        q: search,
        status: statusFilter?.length ? statusFilter : undefined,
      },
    }),
    queryKey,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    const submissionId = searchParams.get("submissionId")
    if (submissionId) {
      setSelectedSubmissionId(submissionId)
      setIsModalOpen(true)
    }
  }, [searchParams])

  const handleRowClicked = (submission: Submission) => {
    setSelectedSubmissionId(submission.id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSubmissionId(null)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("submissionId")
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.replace(newUrl)
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Submissions</h1>
      </div>
      <SubmissionsListTemplate
        submissions={data?.response?.submissions || []}
        rowCount={data ? data.response?.count : 0}
        isLoading={isLoading}
        onRowClick={handleRowClicked}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        search={search}
        setSearch={setSearch}
      />
      <SubmissionDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        submissionId={selectedSubmissionId || undefined}
      />
    </div>
  )
}