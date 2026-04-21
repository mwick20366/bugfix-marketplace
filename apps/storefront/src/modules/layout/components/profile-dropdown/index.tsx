// src/modules/layout/components/profile-dropdown/index.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { User } from "@medusajs/icons"
import { Avatar, Copy } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProfileDropdownProps = {
  name: string
  email?: string
  avatarUrl?: string
  profileHref?: string
  onLogout: () => void
}

export default function ProfileDropdown({
  name,
  email,
  avatarUrl,
  profileHref = "/account/profile",
  onLogout,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Get initials for Avatar fallback
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  return (
    <div className="relative flex items-center gap-x-2" ref={ref}>
      <span className="text-ui-fg-subtle text-sm hidden small:block">
        Welcome, {name}
      </span>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-ui-border-base hover:opacity-80 transition-opacity"
        aria-label="Profile menu"
      >
        {avatarUrl ? (
          <Avatar src={avatarUrl} fallback={initials} />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-ui-bg-subtle">
            <User className="text-ui-fg-subtle" />
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-48 bg-white border border-ui-border-base rounded-md shadow-md z-[100]">
          {email && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-ui-border-base">
              <span className="text-xs text-ui-fg-muted truncate max-w-[120px]">{email}</span>
              <Copy content={email} />
            </div>
          )}
          <LocalizedClientLink
            href={profileHref}
            onClick={() => setOpen(false)}
            className="block w-full text-left px-4 py-2 text-sm text-ui-fg-base hover:bg-ui-bg-subtle transition-colors"
          >
            Profile
          </LocalizedClientLink>
          <button
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
            className="w-full text-left px-4 py-2 text-sm text-ui-fg-base hover:bg-ui-bg-subtle transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}