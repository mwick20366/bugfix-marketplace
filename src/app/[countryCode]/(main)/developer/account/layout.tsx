import { retrieveDeveloper } from "@lib/data/developer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/developer/account/templates/account-layout"

export default async function AccountPageLayout({
  dashboard,
  login,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
}) {
  const developer = await retrieveDeveloper().catch(() => null)

  console.log("Developer in layout:", developer)

  return (
    <AccountLayout developer={developer}>
      {developer ? dashboard : login}
      <Toaster />
    </AccountLayout>
  )
}
