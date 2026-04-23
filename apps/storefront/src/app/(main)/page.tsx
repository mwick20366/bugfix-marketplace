// src/app/(main)/page.tsx
import { getCountryCode } from "@lib/data/cookies"
import { getActorType } from "@modules/common/functions/get-actor-type"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function Home() {
  const countryCode = await getCountryCode()

  if (!countryCode) {
    return null
  }

  const actorType = await getActorType()

  if (actorType === "client") {
    redirect("/client/account")
  }

  if (actorType === "developer") {
    redirect("/developer/account")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-16 px-8">
      <Image
        src="/images/primary-logo.png"
        alt="Bugixa"
        width={500}
        height={164}
        priority
      />
      <div className="flex gap-x-4">
        <a
          href="/marketplace"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Browse Bugs
        </a>
        <a
          href="/developer/account"
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          Developer Dashboard
        </a>
        <a
          href="/client/account"
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          Client Dashboard
        </a>
      </div>
    </div>
  )
}
