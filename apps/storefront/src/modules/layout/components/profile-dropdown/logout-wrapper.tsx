// src/modules/layout/components/profile-dropdown/logout-wrapper.tsx
"use client"

import { logout } from "@lib/data/auth-actions"
import ProfileDropdown from "."

type Props = {
  name: string,
  profileHref?: string,
  avatarUrl?: string,
}

export default function ProfileDropdownWrapper({ name, avatarUrl, profileHref }: Props) {
  return (
    <ProfileDropdown
      name={name}
      avatarUrl={avatarUrl}
      profileHref={profileHref}
      onLogout={() => logout()}
    />
  )
}