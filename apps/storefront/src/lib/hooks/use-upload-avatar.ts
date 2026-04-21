// src/lib/hooks/use-upload-avatar.ts
"use client"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { uploadAvatar } from "@lib/data/profile-avatar"

type UploadAvatarInput = {
  file: File
}

type UploadAvatarResult = {
  files: { id: string; url: string }[]
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const useUploadAvatar = (
  options?: UseMutationOptions<UploadAvatarResult, Error, UploadAvatarInput>
) => {
  return useMutation({
    mutationFn: ({ file }: UploadAvatarInput) => {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File "${file.name}" exceeds the maximum allowed size of 5MB.`
        )
      }
      return uploadAvatar({ file })
    },
    ...options,
  })
}