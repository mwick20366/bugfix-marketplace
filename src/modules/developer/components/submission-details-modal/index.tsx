"use client";

import { Submission } from "@lib/data/submissions";
import { Button, Heading, Label, Text as BugzapperText } from "@medusajs/ui";
import Modal from "@modules/common/components/modal";

interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  submission: Submission; // Optional: show which submission is being claimed
}

export default function SubmissionDetailsModal({ 
  isOpen, 
  onClose = () => {}, 
  onConfirm = () => {},
  submission,
}: SubmissionDetailsModalProps) {
  return (
    <Modal isOpen={isOpen} close={onClose}>
      <Modal.Title>Submission Details</Modal.Title>
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
        <div className="flex flex-col gap-y-2">
          <Label>Status</Label>
          <BugzapperText>{submission?.status}</BugzapperText>
        </div>
        {submission?.client_notes && (
          <div className="flex flex-col gap-y-2">
            <Label>Client Notes</Label>
            <BugzapperText>{submission.client_notes}</BugzapperText>
          </div>
        )}        
      </Modal.Body>
      <Modal.Footer>
        <div className="flex items-center gap-x-2">
          {submission?.status === "client approved" && (
            <Button
              variant="primary"
              onClick={onConfirm}
            >
              Get Paid! (${submission?.bug?.bounty})
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
