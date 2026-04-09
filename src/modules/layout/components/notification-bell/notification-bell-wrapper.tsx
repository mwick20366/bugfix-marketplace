// src/modules/layout/components/notification-bell/notification-bell-wrapper.tsx
"use client"

import { useClientNotifications, useDeveloperNotifications } from "@lib/hooks/use-notifications"
import NotificationBell from "."

export function ClientNotificationBell() {
  const { data } = useClientNotifications()
  return (
    <NotificationBell
      unreadCount={data?.unread_count ?? 0}
      href="/client/account/notifications"
    />
  )
}

export function DeveloperNotificationBell() {
  const { data } = useDeveloperNotifications()
  return (
    <NotificationBell
      unreadCount={data?.unread_count ?? 0}
      href="/developer/account/notifications"
    />
  )
}
