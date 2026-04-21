// src/app/[countryCode]/(main)/developer/profile/page.tsx
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Developer, retrieveDeveloper } from "@lib/data/developer"
import DeveloperProfile from "@modules/developer/components/profile"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your Bugzapper Marketplace profile.",
}

export default async function Profile() {
  const developerData = await retrieveDeveloper().catch(() => null)

  if (!developerData) {
    notFound()
  }

  const { developer } = developerData

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Profile</h1>
        <p className="text-base-regular">
          View and update your profile information, including your name and
          avatar.
        </p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <DeveloperProfile developer={developer} />
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />
}