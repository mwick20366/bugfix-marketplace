"use client"
import React from "react"
import {
  Submission,
  listSubmissions
} from "@lib/data/submissions"
import {
  DataTablePaginationState,
  DataTableSortingState,
  DataTableColumnDef,
} from "@medusajs/ui"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import SubmissionDetailsModal from "@modules/client/components/submission-details-modal"
import SubmissionsListTemplate from "@modules/submissions/components/list-template"
import { useClientMe } from "@lib/hooks/use-client-me"
import { clientStatusColumn, descriptionColumn, notesColumn, submittedColumn, titleColumn } from "@modules/submissions/components/list-template/columns"
import ApprovalModal from "@modules/approval/components/approval-modal"

const columns = [
  titleColumn,
  descriptionColumn,
  notesColumn,
  submittedColumn,
  clientStatusColumn,
]

const SUBMISSION_LIMIT = 15

type DeveloperSubmissionsProps = {
  queryParams: {
    limit?: number
    offset?: number
    q?: string
  }
}

export default function DeveloperSubmissions(props: DeveloperSubmissionsProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentSession, setPaymentSession] = useState<any>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false)
  
  const { client } = useClientMe()

  if (!client) {
    return <div className="py-12">Please log in to view your submissions.</div>
  }

  const queryParams = {
    limit: SUBMISSION_LIMIT,
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
    return ["developer-submissions", limit, offset, search, sorting?.id, sorting?.desc]
  }, [offset, search, sorting?.id, sorting?.desc])

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => listSubmissions({
      queryParams: {
        ...queryParams,
        limit,
        offset,
        order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
        q: search,
      },
    }),
    queryKey,
    placeholderData: keepPreviousData,
    // enabled: false, // Disable automatic fetching on mount
  })

  useEffect(() => {
    refetch()
    // Fetch data when component mounts or dependencies change
  }, [])

  const handleApprove = (clientSecret: string, paymentSession: any) => {
    console.log("Client secret and payment session received in parent component:", { clientSecret, paymentSession })
    setClientSecret(clientSecret)
    setPaymentSession(paymentSession)
    // setIsPaymentModalOpen(true)
  }

  const handleRowClicked = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsDetailsModalOpen(true)
  }

  const handlePaymentComplete = () => {
    // setIsPaymentModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false)
    // setSelectedSubmission(null)
    // setClientSecret(null)
    // setIsPaymentModalOpen(false)
  }

  useEffect(() => {
    console.log("Checking if we should open payment modal with clientSecret and paymentSession:", { clientSecret, paymentSession })
    if (clientSecret && paymentSession) {
      setIsPaymentModalOpen(true)
    } else {
      setIsPaymentModalOpen(false)
    }
  }, [clientSecret, paymentSession])

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Submissions</h1>
      </div>
      <SubmissionsListTemplate
        submissions={data?.response?.submissions || []}
        columns={columns as DataTableColumnDef<Submission>[]}
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
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        // onConfirm={handleClaimBug}
        submission={selectedSubmission!}
      />
      <ApprovalModal
        isOpen={isPaymentModalOpen}
        onClose={handleCloseModal}
        clientSecret={clientSecret!}
        paymentSession={paymentSession}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  )
}
