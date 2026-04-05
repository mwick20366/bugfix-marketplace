// src/modules/layout/components/profile-dropdown/index.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { User } from "@medusajs/icons"
import { Copy } from "@medusajs/ui"

type ProfileDropdownProps = {
  name: string
  email?: string
  onLogout: () => void
}

export default function ProfileDropdown({ name, email, onLogout }: ProfileDropdownProps) {
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

  return (
    <div className="relative flex items-center gap-x-2" ref={ref}>
      <span className="text-ui-fg-subtle text-sm hidden small:block">
        Welcome, {name}
      </span>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-ui-bg-subtle hover:bg-ui-bg-base border border-ui-border-base transition-colors"
        aria-label="Profile menu"
      >
        <User className="text-ui-fg-subtle" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-48 bg-white border border-ui-border-base rounded-md shadow-md z-[100]">
          {email && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-ui-border-base">
              <span className="text-xs text-ui-fg-muted truncate max-w-[120px]">{email}</span>
              <Copy content={email} />
            </div>
          )}
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