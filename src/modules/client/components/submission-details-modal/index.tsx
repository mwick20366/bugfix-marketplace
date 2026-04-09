"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Submission } from "@lib/data/submissions";
import { Button, Heading, Label, Text as BugzapperText, Textarea, toast } from "@medusajs/ui";
import Modal from "@modules/common/components/modal";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { InitiateSubmissionApprovalSchema, initiateSubmissionApprovalSchema } from "./validators";
// import { ApproveRejectSubmissionSchema, approveRejectSubmissionSchema } from "./validators";
import { useQueryClient } from "@tanstack/react-query";
import { useInitiateSubmissionApproval } from "@lib/hooks/use-initiate-submission-approval copy";
// import { useApproveSubmission } from "@lib/hooks/use-finalize-submission-approval";
import { useRejectSubmission } from "@lib/hooks/use-reject-submission";

interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprovalInitiated?: () => void;
  onReject?: () => void;
  submission: Submission; // Optional: show which submission is being claimed
}

export default function SubmissionDetailsModal({ 
  isOpen, 
  onClose = () => {}, 
  onApprovalInitiated = () => {}, 
  onReject = () => {},
  submission,
}: SubmissionDetailsModalProps) {
  const form = useForm<InitiateSubmissionApprovalSchema>({
    resolver: zodResolver(initiateSubmissionApprovalSchema),
    mode: "onChange",
    // defaultValues: {
    //     notes: "",
    // },
  })

  const [showForm, setShowForm] = useState(false)

  const queryClient = useQueryClient();

  // const { mutate: initiateApproval, isPending: approveIsPending } = useInitiateSubmissionApproval(submission?.id, {
  //   onSuccess: ({ submission, clientSecret, paymentSession }) => {
  //     queryClient.invalidateQueries({ queryKey: ["my-bugs"] })
  //     queryClient.invalidateQueries({ queryKey: ["developer-submissions"] })
  //     queryClient.invalidateQueries({ queryKey: ["client-me"] })
  //     toast.success(`Fix approved successfully`)

  //     onApprove(clientSecret, paymentSession) // Optionally update parent state immediately after approval
  //     onClose()
  //   },
  //   onError: (error) => {
  //     toast.error(`Failed to approve fix: ${error.message}`)
  //   },
  // })

  // const { mutate: reject, isPending: rejectIsPending } = useRejectSubmission(submission?.id, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["my-bugs"] })
  //     queryClient.invalidateQueries({ queryKey: ["developer-submissions"] })
  //     queryClient.invalidateQueries({ queryKey: ["client-me"] })
  //     toast.success(`Fix rejected successfully`)

  //     onReject?.()
  //     onClose()
  //   },
  //   onError: (error) => {
  //     toast.error(`Failed to reject fix: ${error.message}`)
  //   },
  // })

  const handleClose = () => {
    onClose()
  }

  const displayButtons = () => {
    // TODO: Remove comments after testing
    // if (submission?.status === "awaiting client review") {
      return (
        <>
          {/* {!showForm && ( */}
            <Button type="button" variant="primary" onClick={() => onApprovalInitiated()}>
              Approve
            </Button>
          {/* )} */}

          {/* {showForm && (
            <Button
              variant="primary"
              isLoading={approveIsPending}
              type="button"
              onClick={() => {
                handleConfirmFix()
                // setIsApproving(true)
                // approveReject(form.getValues())
              }}
              // type="submit"
            >
              Confirm Fix
              {isApproving ? "Confirm Fix" : "Approve"}
            </Button>
          )} */}
        </>
      )
    // }

    return null
  }

//   const handleConfirmFix = async () => {
//     // Call your approval API route to create the payment session
//     const { notes } = form.getValues()
//     const { id } = submission || {}

//     approve({ notes })
// }

  // const handleSubmit = form.handleSubmit(async (data) => {
  //   handleConfirmFix();
  //   // approveReject(data)
  //   // Call your approval API route to create the payment session
  //   // const { notes } = form.getValues()
  //   // const { id } = submission || {}
  //   // const { submission: updatedSubmission, clientSecret, paymentSession } = await initiateApprovalPayment(id, notes)
  
  //   // onApprove?.(clientSecret, paymentSession) // Optionally update parent state immediately after approval
  //   // Then show the payment modal with the returned clientSecret
  //   // setClientSecret(clientSecret)
  //   // setPaymentSession(paymentSession)
  //   // setShowPaymentModal(true)    
  // })

  return (
    <Modal isOpen={isOpen} close={handleClose}>
      <Modal.Title>Submission Details</Modal.Title>
      {/* <FormProvider {...form}> */}
        {/* <form onSubmit={handleSubmit} className="flex h-full flex-col overflow-hidden"> */}
          <Modal.Body>
            <Heading level="h2">{submission?.bug?.title}</Heading>
            <div className="flex flex-col gap-y-2">
              <Label>Bug Description</Label>
              <BugzapperText>{submission?.bug?.description}</BugzapperText>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Bounty</Label>
              <BugzapperText>${submission?.bug?.bounty}</BugzapperText>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>Fix Description</Label>
              <BugzapperText>{submission?.notes}</BugzapperText>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>File URL</Label>
              <a href={submission?.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {submission?.file_url}
              </a>
            </div>
            {/* {showForm && (
              <Controller
                control={form.control}
                name="notes"
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col gap-y-2">
                    <Textarea placeholder={"Notes"} {...field} rows={5} />
                    {error && <span className="text-red-500 text-sm">{error.message}</span>}
                  </div>
                )}
              />
            )} */}
            {submission?.client_notes && (
              <div className="flex flex-col gap-y-2">
                <Label>Notes</Label>
                <BugzapperText>{submission.client_notes}</BugzapperText>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex items-center gap-x-2">
              {displayButtons()}
            </div>
          </Modal.Footer>
        {/* </form>
      </FormProvider> */}
    </Modal>
  );
}
