// src/lib/data/profile-avatar.ts
import { getAuthToken } from "./auth-token"

export const uploadAvatar = async ({
  file,
}: {
  file: File
}): Promise<{ files: { id: string; url: string }[] }> => {
  const token = await getAuthToken()

  const fd = new FormData()
  fd.append("files", file)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/profile/avatar`,
    {
      method: "POST",
      body: fd,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  )

  return response.json()
}