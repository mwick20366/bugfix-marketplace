// src/components/bugs/bug-details-modal.tsx
"use client"

import { Button } from "@medusajs/ui"
import { Bug } from "@lib/data/bugs"
import Modal from "@modules/common/components/modal"
import { DetailRow } from "@modules/marketplace/components/bug-details-modal"
import { StatusBadge, DifficultyBadge } from "@modules/common/components/bug-badges"
import React, { useEffect } from "react"
import MessageThread from "@modules/messaging/components/message-thread"
import { markMessagesRead } from "@lib/data/messages"

type BugDetailsModalProps = {
  bug: Bug | null
  isOpen: boolean
  onClose: () => void
  onSubmitFix: (bug: Bug) => void
  onUnclaim: (bug: Bug) => void
  isUnclaiming?: boolean
  currentUserId: string
}

export const BugDetailsModal = ({
  bug,
  isOpen,
  onClose,
  onSubmitFix,
  onUnclaim,
  isUnclaiming,
  currentUserId,
}: BugDetailsModalProps) => {
  if (!bug) return null

  useEffect(() => {
    if (isOpen && bug?.id && (bug.status === "claimed" || bug.status === "fix submitted")) {
      markMessagesRead({ bugId: bug.id, actorType: "developer" }) // or "client"
    }
  }, [isOpen, bug?.id])

  const canSubmitFix = bug.status === "claimed"
  const canUnclaim = bug.status === "claimed"

  return (
    <Modal isOpen={isOpen} close={onClose} size="large">
      <Modal.Title>Bug Details</Modal.Title>
      <Modal.Body>
        <div className="flex flex-col gap-y-2">
          <DetailRow label="Title">{bug.title}</DetailRow>
          <DetailRow label="Description">{bug.description}</DetailRow>
          {bug.repo_link && (
            <DetailRow label="Repository URL">
              <a
                href={bug.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                {bug.repo_link}
              </a>
            </DetailRow>
          )}
          {bug.tech_stack && (
            <DetailRow label="Tech Stack">{bug.tech_stack}</DetailRow>
          )}
          <DetailRow label="Bounty">${bug.bounty}</DetailRow>
          <DetailRow label="Difficulty">
            <DifficultyBadge difficulty={bug.difficulty ?? ""} />
          </DetailRow>
          <DetailRow label="Status">
            <StatusBadge status={bug.status ?? ""} />
          </DetailRow>
        </div>
        {(bug.status === "claimed" || bug.status === "fix submitted") && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-semibold mb-2">Messages</p>
            <MessageThread
              bugId={bug.id}
              currentUserId={currentUserId}
              currentUserType="developer"
            />
          </div>
        )}        
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => canUnclaim && onUnclaim(bug)}
          disabled={!canUnclaim}
          isLoading={isUnclaiming}
        >
          Unclaim
        </Button>
        <Button
          variant="primary"
          onClick={() => canSubmitFix && onSubmitFix(bug)}
          disabled={!canSubmitFix}
        >
          Submit Fix
        </Button>
      </Modal.Footer>
    </Modal>
  )
}