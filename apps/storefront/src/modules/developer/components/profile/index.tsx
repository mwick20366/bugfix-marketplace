// src/modules/developer/components/profile/index.tsx
"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Button, Label, toast } from "@medusajs/ui"
import { useDropzone } from "react-dropzone"
import { useUploadAvatar } from "@lib/hooks/use-upload-avatar"
import {
  Developer,
  initiateDeveloperOnboarding,
  updateDeveloper,
} from "@lib/data/developer"
import { useQueryClient } from "@tanstack/react-query"
import StockAvatarModal from "@modules/common/components/stock-avatar-modal"
import PayoutSetup from "../payout-setup"

type Props = {
  developer: Developer
}

type ProfileFormValues = {
  first_name: string
  last_name: string
  tech_stack?: string
}

export default function DeveloperProfile({ developer }: Props) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    developer.avatar_url || null
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)
  const [onboardingSecret, setOnboardingSecret] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const { mutateAsync: uploadAvatar } = useUploadAvatar()

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      first_name: developer.first_name || "",
      last_name: developer.last_name || "",
      tech_stack: developer.tech_stack || "",
    },
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  })

  const handleSelectStockAvatar = (url: string) => {
    setAvatarFile(null) // clear any uploaded file
    setAvatarPreview(url)
  }

  const handleStartOnboarding = async () => {
    // Call https://bugixa.com to get the secret we discussed earlier
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/developers/me/onboarding`,
      {
        method: "POST",
      }
    )
    const { client_secret } = await res.json()
    setOnboardingSecret(client_secret)
  }

  const handleSetupPayouts = async () => {
    try {
      // 1. Call your AWS backend at https://api.bugixa.com
      const response = await initiateDeveloperOnboarding()

      // 2. We now expect client_secret for the embedded component
      const { client_secret } = response

      if (client_secret) {
        setOnboardingSecret(client_secret) // This triggers the PayoutSetup component to show
      }
    } catch (err) {
      console.error("Error initiating payout setup:", err)
      toast.error("Could not initiate payout setup.")
    }
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsStockModalOpen(false)
    setIsSubmitting(true)
    setError(null)

    try {
      let avatarUrl: string | undefined

      if (avatarFile) {
        // User uploaded a new file
        const result = await uploadAvatar({ file: avatarFile })
        avatarUrl = result.files?.[0]?.url
      } else if (avatarPreview && avatarPreview !== developer.avatar_url) {
        // User selected a stock avatar (URL changed but no file upload)
        avatarUrl = avatarPreview
      }

      await updateDeveloper({
        first_name: data.first_name,
        last_name: data.last_name,
        tech_stack: data.tech_stack,
        ...(avatarUrl && { avatar_url: avatarUrl }),
      })

      toast.success("Profile updated successfully")
      queryClient.invalidateQueries({ queryKey: ["developer-me"] })
    } catch (e: any) {
      setError(e.message || "Failed to update profile.")
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <div className="max-w-sm flex flex-col gap-y-6">
      <h1 className="text-large-semi uppercase">My Profile</h1>
      <form className="w-full flex flex-col gap-y-4" onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="flex flex-col gap-y-2">
          <Label>Profile Avatar</Label>
          {avatarPreview && (
            <div className="flex items-center gap-x-3 mb-2">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover border border-ui-border-strong"
              />
              <button
                type="button"
                onClick={() => {
                  setAvatarFile(null)
                  setAvatarPreview(null)
                }}
                className="text-xs text-ui-fg-muted hover:text-ui-fg-base"
              >
                Remove
              </button>
            </div>
          )}
          <div
            {...getRootProps()}
            className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-ui-border-interactive bg-ui-bg-subtle"
                : "border-ui-border-strong bg-ui-bg-component"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-ui-fg-muted">
              {isDragActive
                ? "Drop your avatar here..."
                : "Drag and drop an image, or click to select"}
            </p>
          </div>
          {/* Stock avatar link */}
          <button
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="text-xs text-ui-fg-interactive hover:underline text-left"
          >
            Or choose from stock avatars
          </button>
        </div>

        {/* Name Fields */}
        <Input
          label="First name"
          {...form.register("first_name", { required: true })}
          autoComplete="given-name"
        />
        <Input
          label="Last name"
          {...form.register("last_name", { required: true })}
          autoComplete="family-name"
        />
        <Input
          label="Tech Stack"
          {...form.register("tech_stack", { required: true })}
          autoComplete="tech-stack"
        />

        <ErrorMessage error={error} />
        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Save Changes
        </Button>
        {/* Payout Settings Section */}
        <div className="mt-8 pt-8 border-t border-ui-border-base flex flex-col gap-y-4">
          <h2 className="text-base-semi uppercase">Payout Settings</h2>

          {onboardingSecret ? (
            <PayoutSetup clientSecret={onboardingSecret} />
          ) : (
            <>
              {/* 
                Check if they are ACTUALLY verified. 
                If they have an ID but aren't verified, we still show the "Set Up" button 
              */}
              {developer.is_payout_ready ? (
                <div className="bg-ui-bg-subtle border border-ui-border-base rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <span className="text-ui-fg-base text-small-semi">
                      Bank Account Linked ✅
                    </span>
                  </div>
                  <Button variant="secondary" onClick={handleSetupPayouts}>
                    Manage Payouts
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-small-regular text-ui-fg-muted">
                    To receive bounties, you need to securely link your bank
                    account via Stripe.
                  </p>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSetupPayouts}
                  >
                    {developer.stripe_account_id
                      ? "Complete Bank Setup"
                      : "Set Up Payouts"}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </form>
      {/* Stock Avatar Modal */}
      <StockAvatarModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onSelect={handleSelectStockAvatar}
      />
    </div>
  )
}
