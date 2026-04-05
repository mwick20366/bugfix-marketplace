// src/modules/layout/components/profile-dropdown/logout-wrapper.tsx
"use client"

import { logout } from "@lib/data/auth-actions"
import ProfileDropdown from "."

type Props = {
  name: string
}

export default function ProfileDropdownWrapper({ name }: Props) {
  return (
    <ProfileDropdown
      name={name}
      onLogout={() => logout()}
    />
  )
}