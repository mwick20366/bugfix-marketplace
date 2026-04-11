// src/modules/messaging/components/unread-message-badge/index.tsx
"use client"

import { Badge } from "@medusajs/ui"
import { useUnreadMessageCount } from "@lib/hooks/use-messages"

type UnreadMessageBadgeProps = {
  bugId: string
  currentUserId: string
  currentUserType: "client" | "developer"
}

export default function UnreadMessageBadge({
  bugId,
  currentUserId,
  currentUserType,
}: UnreadMessageBadgeProps) {
  const { unreadCount } = useUnreadMessageCount(bugId, currentUserId, currentUserType)

  if (!unreadCount) return null

  return (
    <Badge color="blue" size="2xsmall" rounded="full">
      {unreadCount}
    </Badge>
  )
}