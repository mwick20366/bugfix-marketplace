import { retrieveDeveloper } from "@lib/data/developer"
import MyBugsView from "@modules/developer/components/my-bugs-view"
import { redirect } from "next/navigation"
import { getPageMetadata } from "@modules/common/functions/metadata"

export async function generateMetadata() {
  const { metadata } = await getPageMetadata("My Bugs")
  return metadata
}

export default async function Page() {
  const { Sync } = await getPageMetadata("My Bugs")

  const developer = await retrieveDeveloper().catch(() => null)

  if (!developer) {
    redirect(`/login?redirectTo=${encodeURIComponent("/developer/account/my-bugs")}`)
  }

  return (
    <>
      {Sync}
      <div className="py-12">
        <div className="content-container" data-testid="cart-container">
          <MyBugsView />
        </div>
      </div>
    </> 
  )
}
