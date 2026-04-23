// src/modules/layout/components/notification-bell/index.tsx
"use client"

import { BellAlert } from "@medusajs/icons"
import Link from "next/link"

type NotificationBellProps = {
  unreadCount: number
  href: string
}

export default function NotificationBell({ unreadCount, href }: NotificationBellProps) {
  return (
    <Link href={href} className="relative flex items-center justify-center w-8 h-8">
      <BellAlert className="text-white" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  )
}