"use client";

import { Bug } from "@lib/data/bugs";
import { useClaimBug } from "@lib/hooks/use-claim-bug";
import { toast } from "@medusajs/ui";
import Modal from "@modules/common/components/modal";

interface BugDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bug: Bug;
  onReviewSubmission?: () => void; // callback to open your approval/reject modal
}

export default function ClientBugDetailsModal({
  isOpen,
  onClose,
  onConfirm,
  bug,
  onReviewSubmission,
}: BugDetailsModalProps) {
  // const { mutate: claimBug } = useClaimBug(bug?.id);

  console.log("Bug details modal rendered with bug:", bug);

  return (
    <Modal isOpen={isOpen} close={onClose}>
      <Modal.Title>Bug Details</Modal.Title>
      <Modal.Body>
        {/* Always visible details */}
        <div className="space-y-2">
          <p><span className="font-semibold">Title:</span> {bug?.title}</p>
          <p><span className="font-semibold">Description:</span> {bug?.description}</p>
          <p>
            <span className="font-semibold">Repo:</span>{" "}
            <a href={bug?.repo_link} className="text-blue-600 underline" target="_blank" rel="noreferrer">
              {bug?.repo_link}
            </a>
          </p>
          <p><span className="font-semibold">Bounty:</span> ${bug?.bounty}</p>
          <p><span className="font-semibold">Status:</span> {bug?.status}</p>
        </div>

        {/* Shown only when status is 'claimed' */}
        {bug?.status === "claimed" && bug?.claimed_at && (
          <div className="mt-4 p-3 bg-slate-50 rounded-md">
            <p>
              Claimed on: {new Date(bug.claimed_at).toLocaleDateString()}
              {bug?.developer?.first_name && ` by ${bug.developer.first_name}`}
            </p>
          </div>
        )}

        {/* Shown only when status is 'fix submitted' */}
        {bug?.status === "fix submitted" && (
          <div className="mt-4">
            <button
              onClick={() => {
                onClose();
                onReviewSubmission?.();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
            >
              Review Submission
            </button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}