"use client";

import { Bug } from "@lib/data/bugs";
import { markMessagesRead } from "@lib/data/messages";
import { Button, Tooltip } from "@medusajs/ui";
import { DifficultyBadge, StatusBadge } from "@modules/common/components/bug-badges";
import Modal from "@modules/common/components/modal";
import { DetailRow } from "@modules/marketplace/components/bug-details-modal";
import MessageThread from "@modules/messaging/components/message-thread";
import { useEffect } from "react";

interface BugDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bug: Bug;
  onReviewSubmission?: () => void;
  onEdit: (bug: Bug) => void;
  onDelete: (bug: Bug) => void;
  currentUserId: string;
}

export default function ClientBugDetailsModal({
  isOpen,
  onClose,
  onConfirm,
  bug,
  onReviewSubmission,
  onEdit,
  onDelete,
  currentUserId,
}: BugDetailsModalProps) {
    useEffect(() => {
      if (isOpen && bug?.id && (bug.status === "claimed" || bug.status === "fix submitted")) {
        markMessagesRead({ bugId: bug.id, actorType: "client" }) // or "developer"
      }
    }, [isOpen, bug?.id])

  const canDelete = bug?.status === "open";

  const deleteButton = (
    <Button
      variant="danger"
      onClick={() => canDelete && onDelete(bug)}
      disabled={!canDelete}
    >
      Delete
    </Button>
  );

  return (
    <Modal isOpen={isOpen} close={onClose} size="large">
      <Modal.Title>Bug Details</Modal.Title>
      <Modal.Body>
        <div className="flex flex-col gap-y-2">
          <DetailRow label="Title">{bug?.title}</DetailRow>
          <DetailRow label="Description">{bug?.description}</DetailRow>
          <DetailRow label="Repo">
            <a
              href={bug?.repo_link}
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              {bug?.repo_link}
            </a>
          </DetailRow>
          <DetailRow label="Bounty">${bug?.bounty}</DetailRow>
          <DetailRow label="Difficulty">
            <DifficultyBadge difficulty={bug?.difficulty ?? ""} />
          </DetailRow>
          <DetailRow label="Status">
            <StatusBadge status={bug?.status ?? ""} />
          </DetailRow>

          {bug?.status === "claimed" && bug?.claimed_at && (
            <DetailRow label="Claimed On">
              {new Date(bug.claimed_at).toLocaleDateString()}
              {bug?.developer?.first_name && ` by ${bug.developer.first_name}`}
            </DetailRow>
          )}

          {bug?.status === "fix submitted" && bug?.submissions?.[0]?.created_at && (
            <DetailRow label="Submitted On">
              {new Date(bug.submissions[0].created_at).toLocaleDateString()}
              {bug?.developer?.first_name && ` by ${bug.developer.first_name}`}
            </DetailRow>
          )}
        </div>
        {(bug.status === "claimed" || bug.status === "fix submitted") && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm font-semibold mb-2">Messages</p>
            <MessageThread
              bugId={bug.id}
              currentUserId={currentUserId}
              currentUserType="client"
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {/* Edit and Delete buttons on the left */}
        <div className="flex items-center gap-x-2 mr-auto">
          <Button
            variant="primary"
            onClick={() => onEdit(bug)}
          >
            Edit
          </Button>
          {canDelete ? (
            deleteButton
          ) : (
            <Tooltip content="You can only delete open bugs">
              {deleteButton}
            </Tooltip>
          )}
        </div>

        {/* Review Submission button on the right */}
        {bug?.status === "fix submitted" && (
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onReviewSubmission?.();
            }}
          >
            Review Submission
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}