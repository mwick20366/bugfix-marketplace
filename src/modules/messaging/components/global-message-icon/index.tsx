// src/modules/messaging/components/global-message-icon/index.tsx
"use client"

import { useGlobalUnreadMessageCount } from "@lib/hooks/use-messages"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type GlobalMessageIconProps = {
  currentUserId: string
  currentUserType: "client" | "developer"
}

export default function GlobalMessageIcon({
  currentUserId,
  currentUserType,
}: GlobalMessageIconProps) {
  const { unreadCount } = useGlobalUnreadMessageCount(currentUserId, currentUserType)

  return (
    <LocalizedClientLink
      href={`/${currentUserType}/account/messages`}
      className="relative flex items-center"
      aria-label="Messages"
    >
      {/* Chat bubble icon — swap for your preferred icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
        />
      </svg>

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </LocalizedClientLink>
  )
}