// src/components/bugs/bug-details-modal.tsx
"use client"

import { Button, Label } from "@medusajs/ui"
import { Text as BugzapperText } from "@medusajs/ui"
import { Bug } from "@lib/data/bugs"
import Modal from "@modules/common/components/modal" // your custom Modal wrapper

type BugDetailsModalProps = {
  bug: Bug | null
  isOpen: boolean
  onClose: () => void
  onSubmitFix: (bug: Bug) => void
  onUnclaim: (bug: Bug) => void
  isUnclaiming?: boolean
}

export const BugDetailsModal = ({
  bug,
  isOpen,
  onClose,
  onSubmitFix,
  onUnclaim,
  isUnclaiming,
}: BugDetailsModalProps) => {
  if (!bug) return null

  const canSubmitFix = bug.status === "claimed"
  const canUnclaim = bug.status === "claimed"

  return (
    <Modal isOpen={isOpen} close={onClose} size="medium">
      <Modal.Title>Bug Details</Modal.Title>
      <Modal.Body>
        <div className="flex flex-col gap-y-4">
          <div>
            <Label size="small" weight="plus">Title</Label>
            <BugzapperText>{bug.title}</BugzapperText>
          </div>
          <div>
            <Label size="small" weight="plus">Description</Label>
            <BugzapperText>{bug.description}</BugzapperText>
          </div>
          {bug.repo_link && (
            <div>
              <Label size="small" weight="plus">Repository URL</Label>
              <a
                href={bug.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                {bug.repo_link}
              </a>
            </div>
          )}
          {bug.tech_stack && (
            <div>
              <Label size="small" weight="plus">Tech Stack</Label>
              <BugzapperText>{bug.tech_stack}</BugzapperText>
            </div>
          )}
          <div>
            <Label size="small" weight="plus">Bounty</Label>
            <BugzapperText>${bug.bounty}</BugzapperText>
          </div>
          <div>
            <Label size="small" weight="plus">Status</Label>
            <BugzapperText>{bug.status}</BugzapperText>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex items-center gap-x-2">
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
        </div>
      </Modal.Footer>
    </Modal>
  )
}